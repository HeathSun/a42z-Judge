"use client";
import React, { useState } from "react";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { WarpBackground } from "@/components/magicui/warp-background";
import Link from "next/link";
import { TextAnimate } from "@/components/magicui/text-animate";

export default function ManifestoPage() {
  const [showRankModal, setShowRankModal] = useState(false);
  return (
    <>
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 px-6 py-2 rounded-xl backdrop-blur bg-black/60 border border-white/10 shadow-lg transition-all duration-300 sm:top-2 sm:gap-2 sm:px-2 sm:py-1 sm:text-xs sm:rounded-lg" style={{width:'max-content'}}>
        <Link href="/" passHref legacyBehavior><RainbowButton className="sm:px-2 sm:py-1" asChild><a>Home</a></RainbowButton></Link>
        <Link href="/judge" passHref legacyBehavior><RainbowButton className="sm:px-2 sm:py-1" asChild><a>Judge</a></RainbowButton></Link>
        <Link href="/manifesto" passHref legacyBehavior><RainbowButton className="sm:px-2 sm:py-1" asChild><a>Manifesto</a></RainbowButton></Link>
        <span ><RainbowButton asChild><span className="sm:px-2 sm:py-1" role="button" tabIndex={0} onClick={() => setShowRankModal(true)}>Rank</span></RainbowButton></span>
      </nav>
      {showRankModal && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowRankModal(false)}>
          <div
            className="mt-24 rounded-2xl bg-black/80 shadow-2xl border border-white/10 px-8 py-6 max-w-md w-full flex flex-col items-center animate-slideDown"
            style={{animation: 'slideDown 0.4s cubic-bezier(0.4,0,0.2,1)'}}
            onClick={e => e.stopPropagation()}
          >
            <span className="text-2xl font-bold text-white mb-2">🚧 Under development</span>
            <span className="text-zinc-300 text-center">The Rank feature is coming soon!</span>
            <button className="mt-6 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition" onClick={() => setShowRankModal(false)}>Close</button>
          </div>
          <style jsx global>{`
            @keyframes slideDown {
              0% { transform: translateY(-40px); opacity: 0; }
              100% { transform: translateY(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}
      <div className="fixed inset-0 -z-20 w-full h-full bg-black" />
      <div className="fixed inset-0 -z-10 w-full h-full">
        <FlickeringGrid className="w-full h-full" color="#fff" />
      </div>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="container mx-auto px-4 py-8 flex flex-col items-center">
          <WarpBackground className="max-w-3xl w-full mx-auto mb-20 mt-24 p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-white">a42z - a Manifesto</h1>
          </WarpBackground>
          <div className="prose prose-invert max-w-3xl w-full mx-auto text-lg text-white prose-headings:text-white prose-h2:mt-14 prose-h3:mt-14 prose-h3:mb-6 prose-h2:mb-8 prose-p:my-6 prose-p:mb-8 prose-blockquote:my-8 prose-ul:my-6 prose-li:my-2 prose-blockquote:text-white prose-blockquote:border-white/30 prose-li:marker:text-white">
            <TextAnimate animation="blurIn" as="p">Computing technical trust. At scale.</TextAnimate>
            <TextAnimate animation="blurIn" as="h2" className="text-3xl mt-24 mb-6 font-bold">What is a42z?</TextAnimate>
            <TextAnimate animation="blurIn" as="blockquote">In a world where anyone can fake a demo, we exist to verify what&apos;s real.</TextAnimate>
            <TextAnimate animation="blurIn" as="p">a42z is not just a brand. It&rsquo;s a bet.</TextAnimate>
            <TextAnimate animation="blurIn" as="p">A bet that truth matters in an era flooded with demos, hype, and synthetic signals.</TextAnimate>
            <TextAnimate animation="blurIn" as="p">A bet that real technology should speak for itself.</TextAnimate>
            <TextAnimate animation="blurIn" as="p">We&rsquo;re building the technical trust layer for the age of AI.</TextAnimate>
            <TextAnimate animation="blurIn" as="p">Where others judge projects by pitch decks, we read the code&rsquo;s heartbeat.</TextAnimate>
            <TextAnimate animation="blurIn" as="p">Where others accept screenshots, we verify models in motion.</TextAnimate>
            <TextAnimate animation="blurIn" as="p">Where others see hype, we see signal.</TextAnimate>
            <hr />
            <TextAnimate animation="blurIn" as="h2" className="text-3xl mt-24 mb-6 font-bold">Why “42”?</TextAnimate>
            <TextAnimate animation="blurIn" as="p">Because 42 is the answer to everything, and in our world, it’s the start of something bigger:</TextAnimate>
            <TextAnimate animation="blurIn" as="blockquote">The quest for computable trust.</TextAnimate>
            <TextAnimate animation="blurIn" as="p">Where a16z changed how capital flows,</TextAnimate>
            <TextAnimate animation="blurIn" as="p">a42z changes how trust is earned.</TextAnimate>
            <hr />
            <TextAnimate animation="blurIn" as="h2" className="text-3xl mt-24 mb-6 font-bold">a42z Product Ecosystem</TextAnimate>
            <span className="inline-flex my-8"><RainbowButton variant="outline" size="sm">a42z Judge</RainbowButton></span>
            <TextAnimate animation="blurIn" as="blockquote">Let AI judge AI. Your hackathon’s impartial, tireless, privacy-respecting technical evaluator.</TextAnimate>
            <ul>
              <TextAnimate animation="blurIn" as="li">Evaluates real code/model/API usage, not just slides</TextAnimate>
              <TextAnimate animation="blurIn" as="li">Multi-modal judging: git signals, system traces, documentation depth</TextAnimate>
              <TextAnimate animation="blurIn" as="li">Built for AI hackathons, Demo Days, and dev competitions</TextAnimate>
            </ul>
            <span className="inline-flex my-8"><RainbowButton variant="outline" size="sm">a42z Vault</RainbowButton></span>
            <TextAnimate animation="blurIn" as="blockquote">The secure corridor for due diligence. Founders retain control. Investors gain technical clarity.</TextAnimate>
            <ul>
              <TextAnimate animation="blurIn" as="li">No source code upload required</TextAnimate>
              <TextAnimate animation="blurIn" as="li">AI parses artifacts, diagrams, version history</TextAnimate>
              <TextAnimate animation="blurIn" as="li">Compliant, encrypted, founder-friendly</TextAnimate>
            </ul>
            <span className="inline-flex my-8"><RainbowButton variant="outline" size="sm">a42z Scout</RainbowButton></span>
            <TextAnimate animation="blurIn" as="blockquote">See through the pitch. Your AI-powered technical scout in the early-stage fog.</TextAnimate>
            <ul>
              <TextAnimate animation="blurIn" as="li">Spot high-signal early-stage teams</TextAnimate>
              <TextAnimate animation="blurIn" as="li">Track model originality, architectural boldness, velocity</TextAnimate>
              <TextAnimate animation="blurIn" as="li">Augments VC analysts</TextAnimate>
            </ul>
            <span className="inline-flex my-8"><RainbowButton variant="outline" size="sm">a42z Research</RainbowButton></span>
            <TextAnimate animation="blurIn" as="blockquote">Turn signals into strategy. Deep, AI-powered technical market research for VCs.</TextAnimate>
            <ul>
              <TextAnimate animation="blurIn" as="li">Track trends in model frameworks, security patterns, open-source contributions</TextAnimate>
              <TextAnimate animation="blurIn" as="li">Compare competitors’ code depth</TextAnimate>
              <TextAnimate animation="blurIn" as="li">Guide investment theses with signal, not noise</TextAnimate>
            </ul>
            <span className="inline-flex my-8"><RainbowButton variant="outline" size="sm">a42z Rank</RainbowButton></span>
            <TextAnimate animation="blurIn" as="blockquote">The trust benchmark for technical projects. Cross-stack evaluations. Independent, interpretable, evolving.</TextAnimate>
            <ul>
              <TextAnimate animation="blurIn" as="li">Projects are scored by depth, originality, execution complexity, and signal velocity</TextAnimate>
              <TextAnimate animation="blurIn" as="li">Ranked across categories: LLM infra, agent orchestration, computer vision, on-device AI, etc.</TextAnimate>
              <TextAnimate animation="blurIn" as="li">Transparent criteria. Builder-friendly, investor-usable.</TextAnimate>
            </ul>
            <TextAnimate animation="blurIn" as="h2" className="text-3xl mt-24 mb-6 font-bold">Our Mission</TextAnimate>
            <TextAnimate animation="blurIn" as="blockquote">To build the protocol of technical trust for the age of generative hype.</TextAnimate>
            <TextAnimate animation="blurIn" as="p">In the AI century, pitch theatre must die.</TextAnimate>
            <TextAnimate animation="blurIn" as="p">Only builders should rise.</TextAnimate>
            <TextAnimate animation="blurIn" as="p">We believe:</TextAnimate>
            <ul>
              <TextAnimate animation="blurIn" as="li">Real tech has a trace.</TextAnimate>
              <TextAnimate animation="blurIn" as="li">Real builders leave signal.</TextAnimate>
              <TextAnimate animation="blurIn" as="li">And signal, if parsed right, becomes truth.</TextAnimate>
            </ul>
            <TextAnimate animation="blurIn" as="p">We are a42z.</TextAnimate>
            <TextAnimate animation="blurIn" as="p">We read between the lines of hype.</TextAnimate>
            <TextAnimate animation="blurIn" as="p">We are the signal engine of the AI century.</TextAnimate>
            <div className="h-32" />
          </div>
        </div>
      </div>
    </>
  );
} 