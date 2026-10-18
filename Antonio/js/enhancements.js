/*! Copyright (c) 2026 Abdullahi Mohamud / Uncanny Stranger. Original photography, writing and custom enhancements reserved. Third-party components retain their respective licenses. */
/* Enhancement lifecycle: clean up on AJAX navigation and rebuild at responsive boundaries. */
(function () {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) document.body.classList.remove("smooth-scroll");
  let context;
  let navigationCleanup;
  let hashTimer;
  let journalContext;
  window.SiteEnhancements = function () {
    if (context) context.revert();
    if (navigationCleanup) navigationCleanup();
    clearTimeout(hashTimer);
    if (journalContext) journalContext.revert();
    if (document.querySelector('.journal-index') && !matchMedia('(prefers-reduced-motion:reduce)').matches) {
      journalContext=gsap.context(function() {
        gsap.utils.toArray('.journal-card-image').forEach(image=>{
          gsap.fromTo(image,{clipPath:'inset(8% 0% 8% 0%)'},{clipPath:'inset(0% 0% 0% 0%)',duration:.45,ease:'power2.out',scrollTrigger:{trigger:image,start:'top 90%',once:true}});
        });
      },document.querySelector('.journal-index'));
    }
    const section = document.getElementById('visual-field');
    if (section && window.gsap && window.ScrollTrigger) {
      context = gsap.matchMedia();
      context.add({mobile:"(max-width:767px)", desktop:"(min-width:768px)", reduced:"(prefers-reduced-motion:reduce)", short:"(max-height:599px)"},function (media) {
        const main = section.querySelector('.field-main');
        const companions = Array.from(section.querySelectorAll('.field-companion'));
        const button = section.querySelector('.field-focus');
        const label = button.querySelector('.button-text span');
        const step = section.querySelector('.field-step');
        const reduced = media.conditions.reduced;
        section.classList.remove('field-reduced','field-is-focused');
        companions.forEach(plate => { plate.inert=false; });
        gsap.set(main,{xPercent:-50,yPercent:-50,x:0,y:0,scale:.86});
        if (reduced || media.conditions.short) { section.classList.add('field-reduced'); button.onclick=null; return; }
        let phase = '';
        const mobile = media.conditions.mobile;
        const timeline = gsap.timeline({scrollTrigger:{
          id:'visual-field',trigger:section,start:'top top',
          end:()=>'+=' + Math.round(innerHeight * 1.45),pin:section.querySelector('.field-stage'),
          scrub:.28,invalidateOnRefresh:true,anticipatePin:1,
          onUpdate(self) {
            const focus = self.progress > .3 && self.progress < .78;
            section.classList.toggle('field-is-focused',focus);
            companions.forEach(plate=>{if (focus && plate.contains(document.activeElement)) button.focus({preventScroll:true}); if(plate.inert!==focus)plate.inert=focus;});
            const next = self.progress < .3 ? '01 / The visual field' : self.progress < .78 ? '02 / A closer look' : '03 / Back to the frame';
            if(next!==phase) { phase=next; step.textContent=next; label.textContent=focus?'Back to frames':'Look closer'; button.setAttribute('aria-label',focus?'Return to the visual field':'Look closer at A Pause Above'); }
          }
        }});
        timeline.to(main,{scale:.94,duration:.15,ease:'sine.inOut'},0)
          .to(main,{scale:()=>mobile?1.68:2.2,x:()=>-innerWidth*(mobile?.055:.025),y:0,duration:.36,ease:'power2.inOut'},.15)
          .to(main,{scale:.9,x:0,y:0,duration:.32,ease:'power2.inOut'},.68);
        timeline.to('.field-backdrop',{opacity:1,duration:.20,ease:'sine.inOut'},.18)
          .to('.field-backdrop',{opacity:0,duration:.23,ease:'sine.inOut'},.76);
        timeline.to('.field-heading, .field-location',{opacity:0,x:-20,duration:.15},.15)
          .to('.field-heading, .field-location',{opacity:1,x:0,duration:.18},.82);
        timeline.to('.field-main figcaption',{opacity:0,duration:.12},.18)
          .to('.field-main figcaption',{opacity:1,duration:.16},.82);
        timeline.to('.field-ui',{color:'#f5f0e9',duration:.20},.18)
          .to('.field-ui',{color:'#0c0c0c',duration:.23},.76);
        companions.forEach((plate,i)=> {
          timeline.to(plate,{xPercent:i%2?60:-60,yPercent:i<2?-35:35,scale:.75,opacity:0,duration:.22,ease:'power1.inOut'},.13)
            .to(plate,{xPercent:0,yPercent:0,scale:1,opacity:1,duration:.22,ease:'power1.inOut'},.75);
        });
        timeline.to('.field-progress span',{scaleX:1,duration:1,ease:'none'},0);
        button.onclick=function() {
          const trigger=timeline.scrollTrigger;
          const focus=trigger.progress>.25&&trigger.progress<.8;
          const y=trigger.start + (trigger.end-trigger.start)*(focus?.04:.53);
          const area=document.getElementById('content-scroll');
          const scrollbar=window.Scrollbar&&Scrollbar.get(area);
          if(scrollbar) gsap.to(scrollbar,{scrollTop:y,duration:.7,ease:'power2.inOut'});
          else window.scrollTo({top:y,behavior:'smooth'});
        };
        return () => { button.onclick=null; companions.forEach(plate => { plate.inert=false; }); section.classList.remove('field-is-focused','field-reduced'); };
      },section);
    }
    // Original visual menu; semantic state, focus containment and scroll locking added in place.
    const burger = document.getElementById('burger-wrapper');
    const nav = document.getElementById('primary-navigation');
    nav?.querySelectorAll('li > a[href="#"]').forEach(link=>{
      if(link.textContent.includes('Stories')) { link.setAttribute('href','index-portfolio.html'); link.setAttribute('data-type','page-transition'); }
    });
    const area = document.getElementById('content-scroll');
    const menuText = document.querySelector('.menu > .button-text');
    let wasOpen = false;
    let lockedY = 0;
    let lockedX = 0;
    const scrollbar = window.Scrollbar && area && Scrollbar.get(area);
    const lockScroll = () => { if (wasOpen && scrollbar) scrollbar.setPosition(lockedX,lockedY); };
    const syncMenu = () => {
      if (!burger || !nav) return;
      const isOverlay = matchMedia('(max-width:1024px)').matches || document.querySelector('.fullscreen-menu');
      const open = Boolean(isOverlay && document.getElementById('menu-burger')?.classList.contains('open'));
      burger.setAttribute('aria-expanded',String(open));
      burger.setAttribute('aria-label',open?'Close menu':'Open menu');
      nav.inert=Boolean(isOverlay&&!open);
      document.body.classList.toggle('menu-accessible-open',open);
      if (area) area.inert=open;
      if (open && !wasOpen) {
        lockedY=scrollbar?.offset.y||0; lockedX=scrollbar?.offset.x||0;
        requestAnimationFrame(() => nav.querySelector('a')?.focus({preventScroll:true}));
      }
      if (!open && wasOpen && nav.contains(document.activeElement)) burger.focus({preventScroll:true});
      wasOpen=open;
    };
    const observer = new MutationObserver(syncMenu);
    if (burger && nav) {
      observer.observe(document.getElementById('menu-burger'),{attributes:true,attributeFilter:['class']});
      syncMenu();
      addEventListener('resize',syncMenu);
      scrollbar?.addListener(lockScroll);
      if(menuText) { menuText.setAttribute('aria-hidden','true'); menuText.style.pointerEvents='none'; }
    }
    navigationCleanup = () => { observer.disconnect(); removeEventListener('resize',syncMenu); scrollbar?.removeListener(lockScroll); document.body.classList.remove('menu-accessible-open'); if(area) area.inert=false; };
    // Real, full-area story links also work without pointer-only WebGL callbacks.
    // Native navigation avoids the legacy gallery preview consuming the first click.
    document.querySelectorAll('.img-mask > a.slide-link').forEach(link=>{
      link.removeAttribute('data-type');
      link.addEventListener('click',event=>event.stopPropagation());
    });
    const heroField=document.getElementById('hero-interaction');
    if(heroField) {
      heroField.addEventListener('mouseenter',()=>heroField.classList.add('active'));
      heroField.addEventListener('mouseleave',()=>heroField.classList.remove('active'));
      heroField.addEventListener('focusin',()=>heroField.classList.add('active'));
      heroField.addEventListener('focusout',event=>{if(!heroField.contains(event.relatedTarget))heroField.classList.remove('active');});
    }
    document.querySelectorAll('.cp-button-prev,.cp-button-next,.grid-option,.list-option').forEach(control=>{
      control.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();control.click();}});
    });
    const top = document.getElementById('backtotop');
    if (top && !top.dataset.keyboardReady) {
      top.dataset.keyboardReady = 'true';
      top.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); top.click(); }
      });
    }
    // Deep links use the original smooth-scroll instance rather than replacing it.
    if (location.hash) hashTimer=setTimeout(function () {
      let id; try { id=decodeURIComponent(location.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      const area = document.getElementById('content-scroll');
      const scroll = window.Scrollbar && Scrollbar.get(area);
      if (target && scroll) {
        const destination = target.id === 'contact-formular' ? target.closest('.content-row') : target;
        const y = destination.getBoundingClientRect().top - area.getBoundingClientRect().top + scroll.offset.y;
        scroll.scrollTo(0, Math.max(0,y-(target.id==='visual-field'?0:90)), reduceMotion.matches?0:350);
      }
    }, 750);
    requestAnimationFrame(function () { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
  };
  document.addEventListener('keydown', function (e) {
    const burger = document.getElementById('burger-wrapper');
    const open = document.getElementById('menu-burger')?.classList.contains('open');
    if (e.key === 'Escape' && open && burger) { e.preventDefault(); burger.click(); burger.focus(); }
    if (e.key === 'Tab' && open && burger) {
      const nav=document.getElementById('primary-navigation');
      const controls=[...nav.querySelectorAll('a, button')].filter(el=>el.getClientRects().length&&!el.closest('[inert]'));
      const first=controls[0], last=controls[controls.length-1];
      if(e.shiftKey && (document.activeElement===first||document.activeElement===burger)) {e.preventDefault();last?.focus();}
      else if(!e.shiftKey && document.activeElement===last) {e.preventDefault();burger.focus();}
      else if(!e.shiftKey && document.activeElement===burger) {e.preventDefault();first?.focus();}
    }
  });
})();
