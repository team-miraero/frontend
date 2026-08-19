<template>
  <HeroBackground>
    <StepHeader show-brand :show-back="false">
      <nav class="flex items-center gap-3">
        <RouterLink :to="{ name: ROUTE_NAMES.LOGIN }" class="text-sm font-medium text-gray-600">로그인</RouterLink>
        <RouterLink v-slot="{ navigate }" :to="{ name: ROUTE_NAMES.SIGNUP }" custom><BaseButton size="sm" @click="navigate">시작하기</BaseButton></RouterLink>
      </nav>
    </StepHeader>

    <main ref="scrollSectionRef" class="scroll-story relative">
      <section class="kinetic-stage sticky top-0 h-[calc(100dvh-64px)] min-h-[620px] overflow-hidden" :style="stageStyle">
        <span class="ambient ambient--one" aria-hidden="true"></span><span class="ambient ambient--two" aria-hidden="true"></span>

        <Transition name="soft-fade">
          <div v-if="activeScene === 0" class="scene intro-scene">
            <p>{{ typedLine1 }}<span v-if="typingLine === 1" class="typing-cursor"></span></p>
            <p class="mt-2">{{ typedPart1 }}<span class="text-primary">{{ typedMiraero }}</span>{{ typedPart2 }}<span v-if="showDot" class="sentence-dot"></span><span v-if="typingLine === 2" class="typing-cursor"></span></p>
          </div>
        </Transition>

        <div v-if="activeScene === 1" class="scene portal-scene">
          <p class="portal-caption" :style="portalCaptionStyle">작은 목표 하나에서</p>
          <span class="portal-dot" :style="portalStyle" aria-hidden="true"></span>
          <p class="portal-caption portal-caption--bottom" :style="portalBottomStyle">당신의 미래가 시작돼요</p>
        </div>

        <div v-if="activeScene === 2" class="scene words-scene">
          <p class="word" :style="wordStyle('goal')">목표</p><p class="word word--asset" :style="wordStyle('asset')">자산</p><p class="word word--spending" :style="wordStyle('spending')">소비</p>
          <div class="word-result" :style="wordResultStyle"><span>목표와 금융생활을</span><strong>내 현실에 맞는 계획으로</strong></div>
        </div>

        <div v-if="activeScene === 3" class="scene numbers-scene">
          <span v-for="number in floatingNumbers" :key="number.label" class="flying-number" :style="numberStyle(number)">{{ number.label }}</span>
          <div class="calculation-core" :style="calculationStyle">
            <span class="core-ring core-ring--one" aria-hidden="true"></span><span class="core-ring core-ring--two" aria-hidden="true"></span>
            <p>오늘 여유자금</p><strong>{{ calculatedAvailableMoney.toLocaleString() }}원</strong><span>오늘 지출을 빼고 남은 돈을 찾아드려요</span>
          </div>
        </div>

        <div v-if="activeScene === 4" class="scene roadmap-scene">
          <div class="roadmap-copy"><span>계획보다 조금 늦어져도 괜찮아요</span><strong>흐트러진 페이스를<br />다시 목표에 맞춰드려요</strong></div>
          <div class="pace-board" :style="currentPaceStyle">
            <span class="pace-status" :class="{ 'pace-status--done': roadmapProgress > 0.6 }">{{ paceAdjustmentText }}</span>
            <div class="pace-chart" aria-label="현재 페이스가 목표 페이스에 맞춰지는 모습">
              <span class="route-label route-label--goal">목표 페이스</span>
              <span class="target-route"></span>
              <span class="current-route current-route--start"></span>
              <span class="current-route current-route--join"></span>
              <span class="current-route current-route--finish"></span>
              <span class="pace-pulse" :style="pacePulseStyle"></span>
              <span class="route-label route-label--current">현재 페이스</span>
              <span class="route-goal-dot"></span>
            </div>
            <div class="pace-board-footer"><span>지금</span><span>목표 도착</span></div>
          </div>
        </div>

        <div v-if="activeScene === 5" class="scene finale-scene">
          <div class="coach-question">“이번 달 여행 가도 돼?”</div>
          <span class="finale-halo" aria-hidden="true"></span><img :src="coliImage" alt="페이스메이커 콜리" class="finale-coli" />
          <p class="finale-kicker">AI GOAL COACH</p><h1><span>고민되는 순간마다,</span><span>콜리가 함께할게요</span></h1>
          <p class="finale-description">목표에 무리가 없는지<br />내 금융 데이터를 바탕으로 같이 계산해드려요.</p>
        </div>

        <div class="bottom-action">
          <Transition name="cta-rise" mode="out-in">
            <RouterLink v-if="activeScene === 5" v-slot="{ navigate }" :to="{ name: ROUTE_NAMES.SIGNUP }" custom><button type="button" class="primary-cta" @click="navigate">콜리와 시작하기 →</button></RouterLink>
            <button v-else type="button" class="scroll-guide" :class="{ invisible: activeScene === 0 && !typingFinished }" @click="scrollToNextScene"><span>{{ activeScene === 0 ? '스크롤해서 시작하기' : '계속 내려보기' }}</span><span aria-hidden="true">⌄</span></button>
          </Transition>
        </div>
      </section>
    </main>
  </HeroBackground>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import StepHeader from '@/shared/ui/StepHeader.vue'
import BaseButton from '@/shared/ui/BaseButton.vue'
import HeroBackground from '@/shared/ui/HeroBackground.vue'
import { ROUTE_NAMES } from '@/shared/constants/routes'
import coliImage from '@/assets/images/coli_bottom.png'

const scrollSectionRef = ref(null), scrollProgress = ref(0), rawScrollProgress = ref(0), typedLine1 = ref(''), typedPart1 = ref(''), typedMiraero = ref(''), typedPart2 = ref(''), typingLine = ref(0), showDot = ref(false), typingFinished = ref(false)
const timers = []
let progressFrameId = null
const floatingNumbers = [{ label:'월 수입 3,200,000',x:-118,y:-150,r:-10 },{ label:'고정지출 -920,000',x:112,y:-118,r:8 },{ label:'생활비 -1,680,000',x:-128,y:92,r:7 },{ label:'오늘 지출 -28,000',x:120,y:118,r:-8 },{ label:'목표 5,000만원',x:4,y:-205,r:4 }]
const activeScene = computed(() => scrollProgress.value < .12 ? 0 : scrollProgress.value < .28 ? 1 : scrollProgress.value < .47 ? 2 : scrollProgress.value < .66 ? 3 : scrollProgress.value < .84 ? 4 : 5)
function clamp(start,end){ return Math.min(Math.max((scrollProgress.value-start)/(end-start),0),1) }
const portalProgress=computed(()=>clamp(.12,.28)), wordsProgress=computed(()=>clamp(.28,.47)), numbersProgress=computed(()=>clamp(.47,.66)), roadmapProgress=computed(()=>clamp(.66,.84))
const stageStyle=computed(()=>({'--ambient-shift':`${scrollProgress.value*110}px`,'--ambient-opacity':String(.35+scrollProgress.value*.4)}))
const portalStyle=computed(()=>{const size=18+portalProgress.value**2*1150;return{width:`${size}px`,height:`${size}px`,opacity:String(.55+portalProgress.value*.45)}})
const portalCaptionStyle=computed(()=>({opacity:String(1-portalProgress.value*1.4),transform:`translateY(${-portalProgress.value*24}px)`}))
const portalBottomStyle=computed(()=>({opacity:String(Math.max((portalProgress.value-.55)*2.2,0)),transform:`translateY(${24-portalProgress.value*24}px)`}))
const wordResultStyle=computed(()=>{const reveal=Math.min(Math.max((wordsProgress.value-.82)/.16,0),1);return{opacity:String(reveal),transform:`translateY(${28-reveal*28}px) scale(${.96+reveal*.04})`}})
function wordStyle(type){const p=wordsProgress.value,o={goal:{x:-220,y:-190,r:-13},asset:{x:230,y:-30,r:12},spending:{x:-180,y:190,r:9}}[type],s={goal:{x:0,y:-92},asset:{x:-92,y:34},spending:{x:92,y:34}}[type],enter=Math.min(p/.34,1),exit=Math.min(Math.max((p-.62)/.18,0),1);const x=o.x+(s.x-o.x)*enter,y=o.y+(s.y-o.y)*enter-exit*80;return{opacity:String(Math.min(p*4,1)*(1-exit)),transform:`translate3d(${x}px,${y}px,0) rotate(${o.r*(1-enter)}deg) scale(${.72+enter*.28+exit*.12})`}}
function numberStyle(n){const p=numbersProgress.value,enter=Math.min(p/.22,1),gather=Math.min(Math.max((p-.28)/.3,0),1),vanish=Math.min(Math.max((p-.64)/.14,0),1);return{opacity:String(enter*(1-vanish)),transform:`translate3d(${n.x*(1-gather)}px,${n.y*(1-gather)}px,0) rotate(${n.r*(1-gather)}deg) scale(${1-gather*.42})`}}
const calculationStyle=computed(()=>{const r=Math.min(Math.max((numbersProgress.value-.78)/.18,0),1);return{opacity:String(r),transform:`scale(${.78+r*.22}) translateY(${28-r*28}px)`}})
const calculatedAvailableMoney=computed(()=>{const r=Math.min(Math.max((numbersProgress.value-.8)/.18,0),1);return Math.round((32000*r)/1000)*1000})
const paceAdjustmentText=computed(()=>roadmapProgress.value>.58?'목표 페이스로 조정 완료':'현재 페이스 · 월 13만원 부족')
const currentPaceStyle=computed(()=>{const align=Math.min(Math.max((roadmapProgress.value-.18)/.62,0),1);return{'--pace-gap':`${54*(1-align)}px`,'--pace-angle':`${-24*(1-align)}deg`,'--pace-opacity':String(.35+align*.65)}})
const pacePulseStyle=computed(()=>{const travel=Math.min(Math.max((roadmapProgress.value-.08)/.76,0),1);return{left:`${8+travel*84}%`,top:`${98-travel*54}px`,opacity:String(Math.min(roadmapProgress.value*5,1)),transform:`translate(-50%,-50%) scale(${.8+travel*.25})`}})
function wait(ms){return new Promise(resolve=>timers.push(window.setTimeout(resolve,ms)))}
async function typeText(text,target){let value='';for(const character of text){value+=character;target.value=value;await wait(68)}}
async function runTyping(){await wait(160);typingLine.value=1;await typeText('목표만 정하면,',typedLine1);await wait(200);typingLine.value=2;await typeText('페이스는 ',typedPart1);await typeText('미래로',typedMiraero);await typeText('가 맞출게요',typedPart2);await wait(68);showDot.value=true;typingLine.value=0;typingFinished.value=true}
function animateProgress(){const difference=rawScrollProgress.value-scrollProgress.value;scrollProgress.value+=difference*.14;if(Math.abs(difference)>.0001){progressFrameId=window.requestAnimationFrame(animateProgress)}else{scrollProgress.value=rawScrollProgress.value;progressFrameId=null}}
function updateScrollProgress(){const s=scrollSectionRef.value;if(!s)return;const d=Math.max(s.offsetHeight-window.innerHeight,1);rawScrollProgress.value=Math.min(Math.max(-s.getBoundingClientRect().top/d,0),1);if(progressFrameId===null)progressFrameId=window.requestAnimationFrame(animateProgress)}
function resetToIntro(){scrollProgress.value=0;rawScrollProgress.value=0;window.scrollTo({top:0,left:0,behavior:'auto'});document.documentElement.scrollTop=0;document.body.scrollTop=0}
function scrollToNextScene(){const s=scrollSectionRef.value;if(!s)return;const targets=[0,.16,.32,.51,.7,.9],next=Math.min(activeScene.value+1,5);window.scrollTo({top:s.offsetTop+(s.offsetHeight-window.innerHeight)*targets[next],behavior:'smooth'})}
onBeforeMount(()=>{if('scrollRestoration'in window.history)window.history.scrollRestoration='manual';resetToIntro()})
onMounted(()=>{resetToIntro();window.addEventListener('scroll',updateScrollProgress,{passive:true});window.addEventListener('resize',updateScrollProgress);window.requestAnimationFrame(()=>window.requestAnimationFrame(resetToIntro));runTyping()})
onUnmounted(()=>{window.removeEventListener('scroll',updateScrollProgress);window.removeEventListener('resize',updateScrollProgress);timers.forEach(clearTimeout);if(progressFrameId!==null)window.cancelAnimationFrame(progressFrameId)})
</script>

<style scoped>
.scroll-story{display:block!important;flex:none!important;width:100%;height:900dvh!important;min-height:6000px!important;position:relative}.kinetic-stage{position:sticky;width:100%;height:calc(100dvh - 64px);min-height:0;perspective:1100px;background:rgba(248,251,255,.9)}.scene{position:absolute!important;inset:0!important;z-index:2;width:100%;height:100%;min-height:100%;display:flex;align-items:center;justify-content:center;box-sizing:border-box;padding:24px}.intro-scene{display:grid;place-content:center;justify-items:center;grid-auto-rows:max-content;text-align:center;font-size:clamp(28px,7.2vw,40px);font-weight:900;line-height:1.35;letter-spacing:-.045em;color:#111827}.intro-scene p{width:100%;text-align:center;white-space:nowrap}.typing-cursor{display:inline-block;width:.13em;height:.82em;margin-left:.08em;border-radius:2px;background:#111827;vertical-align:-.04em;animation:blink .9s steps(1) infinite}.sentence-dot{display:inline-block;width:.22em;height:.22em;margin-left:.05em;border-radius:50%;background:#0066ff;vertical-align:.08em;box-shadow:0 0 14px 4px rgba(0,102,255,.4);animation:dot-pop .45s cubic-bezier(.34,1.25,.64,1) both}.ambient{position:absolute;width:300px;height:300px;border-radius:50%;filter:blur(8px);pointer-events:none;opacity:var(--ambient-opacity)}.ambient--one{top:-120px;left:-130px;background:radial-gradient(circle,rgba(0,102,255,.24),transparent 68%);transform:translateY(var(--ambient-shift))}.ambient--two{right:-150px;bottom:-100px;background:radial-gradient(circle,rgba(16,185,129,.18),transparent 68%);transform:translateY(calc(var(--ambient-shift) * -1))}
.portal-scene{flex-direction:column;text-align:center;overflow:hidden}.portal-dot{position:absolute;border-radius:50%;background:radial-gradient(circle at 40% 35%,#2f85ff,#0066ff 60%,#0054d6);box-shadow:0 0 80px rgba(0,102,255,.35)}.portal-caption{position:relative;z-index:2;font-size:clamp(25px,7vw,38px);font-weight:900;letter-spacing:-.04em;color:#111827}.portal-caption--bottom{color:white}.words-scene,.numbers-scene{overflow:hidden}.word{position:absolute;font-size:clamp(66px,21vw,112px);font-weight:900;letter-spacing:-.08em;color:#111827;will-change:transform,opacity}.word--asset{color:#0066ff}.word--spending{color:#13a17b}.word-result{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;color:#4b5563}.word-result strong{font-size:clamp(34px,9vw,48px);letter-spacing:-.05em;color:#111827}.flying-number{position:absolute;max-width:92vw;white-space:nowrap;font-size:clamp(15px,4.4vw,22px);font-weight:900;letter-spacing:-.04em;color:#1f2937;will-change:transform,opacity}
.calculation-core{position:relative;display:flex;width:min(330px,86vw);min-height:210px;flex-direction:column;align-items:center;justify-content:center;border:1px solid rgba(191,219,254,.9);border-radius:28px;background:rgba(255,255,255,.9);box-shadow:0 25px 70px rgba(0,102,255,.16);backdrop-filter:blur(16px)}.calculation-core p{font-size:14px;font-weight:800;color:#6b7280}.calculation-core strong{margin-top:8px;font-size:38px;letter-spacing:-.05em;color:#0066ff}.calculation-core>span:last-child{margin-top:14px;font-size:12px;color:#9ca3af}.core-ring{position:absolute;border:1px solid rgba(0,102,255,.17);border-radius:50%;animation:ring-pulse 2.4s ease-out infinite}.core-ring--one{inset:-22px}.core-ring--two{inset:-46px;animation-delay:.7s}
.roadmap-scene{flex-direction:column}.roadmap-copy{display:flex;flex-direction:column;align-items:center;gap:8px;margin-bottom:48px;text-align:center;color:#6b7280}.roadmap-copy strong{font-size:clamp(28px,7.5vw,40px);line-height:1.25;letter-spacing:-.05em;color:#111827}.pace-board{width:min(350px,90vw);padding:18px 18px 14px;border:1px solid rgba(191,219,254,.85);border-radius:24px;background:rgba(255,255,255,.86);box-shadow:0 22px 60px rgba(0,102,255,.13);backdrop-filter:blur(16px)}.pace-status{display:inline-flex;min-height:30px;align-items:center;padding:0 11px;border-radius:999px;background:#fff7ed;font-size:11px;font-weight:900;color:#ea580c;transition:color .4s ease,background .4s ease,transform .4s cubic-bezier(.16,1,.3,1)}.pace-status--done{background:#eff6ff;color:#0066ff;transform:scale(1.04)}.pace-chart{position:relative;height:130px;margin-top:14px;overflow:hidden}.target-route{position:absolute;top:43px;right:8px;left:8px;border-top:2px dashed #bfdbfe}.route-label{position:absolute;z-index:4;font-size:10px;font-weight:800;white-space:nowrap}.route-label--goal{top:20px;right:4px;color:#0066ff}.route-label--current{bottom:4px;left:4px;color:#94a3b8;opacity:.55}.current-route{position:absolute;z-index:2;height:4px;border-radius:99px;background:linear-gradient(90deg,#60a5fa,#0066ff);box-shadow:0 0 13px rgba(0,102,255,.3);transition:top .12s linear,transform .12s linear}.current-route--start{top:calc(43px + var(--pace-gap));left:8px;width:42%}.current-route--join{top:calc(43px + var(--pace-gap));left:42%;width:30%;transform:rotate(var(--pace-angle));transform-origin:left center}.current-route--finish{top:43px;right:8px;width:30%;opacity:var(--pace-opacity)}.pace-pulse{position:absolute;z-index:5;width:15px;height:15px;border:4px solid white;border-radius:50%;background:#0066ff;box-shadow:0 0 0 7px rgba(0,102,255,.12),0 4px 12px rgba(0,102,255,.28);transition:left .12s linear,top .12s linear}.route-goal-dot{position:absolute;z-index:4;top:36px;right:4px;width:16px;height:16px;border:4px solid white;border-radius:50%;background:#0066ff;box-shadow:0 3px 12px rgba(0,102,255,.28)}.pace-board-footer{display:flex;justify-content:space-between;border-top:1px solid #eff6ff;padding-top:10px;font-size:10px;font-weight:800;color:#94a3b8}
.finale-scene{flex-direction:column;text-align:center}.coach-question{position:relative;z-index:3;margin-bottom:12px;padding:10px 15px;border:1px solid #e5e7eb;border-radius:18px 18px 18px 5px;background:rgba(255,255,255,.96);box-shadow:0 10px 30px rgba(15,23,42,.1);font-size:13px;font-weight:800;color:#374151;animation:coach-bubble .65s .18s cubic-bezier(.16,1,.3,1) both}.finale-halo{position:absolute;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(0,102,255,.2),transparent 68%);animation:halo 2.2s ease-in-out infinite}.finale-coli{position:relative;z-index:1;height:118px;width:auto;animation:coli-enter .8s cubic-bezier(.16,1,.3,1) both}.finale-kicker{margin-top:18px;font-size:11px;font-weight:900;letter-spacing:.14em;color:#0066ff}.finale-scene h1{margin-top:10px;font-size:clamp(30px,8vw,42px);font-weight:900;line-height:1.28;letter-spacing:-.05em;color:#111827}.finale-scene h1 span{display:block;overflow:hidden;animation:text-up .7s cubic-bezier(.16,1,.3,1) both}.finale-description{margin-top:15px;font-size:14px;line-height:1.65;color:#6b7280}.bottom-action{position:absolute;z-index:20;right:20px;bottom:max(22px,env(safe-area-inset-bottom));left:20px;margin:0 auto;max-width:430px}.primary-cta{width:100%;min-height:54px;border-radius:16px;background:#0066ff;padding:0 24px;font-size:16px;font-weight:800;color:white;box-shadow:0 14px 32px rgba(0,102,255,.26)}.scroll-guide{display:flex;width:100%;min-height:48px;flex-direction:column;align-items:center;justify-content:center;border:0;background:transparent;font-size:12px;font-weight:700;color:#6b7280}.scroll-guide span:last-child{font-size:24px;line-height:.7;animation:guide 1.7s ease-in-out infinite}.invisible{opacity:0;pointer-events:none}.soft-fade-enter-active,.soft-fade-leave-active,.cta-rise-enter-active,.cta-rise-leave-active{transition:opacity .45s ease,transform .5s cubic-bezier(.16,1,.3,1)}.soft-fade-enter-from,.soft-fade-leave-to,.cta-rise-enter-from,.cta-rise-leave-to{opacity:0;transform:translateY(14px)}
@keyframes blink{0%,50%{opacity:1}50.01%,100%{opacity:0}}@keyframes dot-pop{from{transform:scale(.35)}to{transform:scale(1)}}@keyframes ring-pulse{from{transform:scale(.85);opacity:.8}to{transform:scale(1.15);opacity:0}}@keyframes halo{0%,100%{transform:scale(.9);opacity:.5}50%{transform:scale(1.08);opacity:1}}@keyframes coli-enter{from{opacity:0;transform:translateY(50px) scale(.72)}70%{transform:translateY(-5px) scale(1.05)}to{opacity:1;transform:none}}@keyframes coach-bubble{from{opacity:0;transform:translateY(18px) scale(.88)}to{opacity:1;transform:none}}@keyframes text-up{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:none}}@keyframes guide{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}
</style>
