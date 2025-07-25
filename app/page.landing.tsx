import React from "react";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { MorphingText } from "@/components/magicui/morphing-text";
import Link from "next/link";
import { VelocityScroll } from "@/components/magicui/scroll-based-velocity";
import { AvatarCircles } from "@/components/magicui/avatar-circles";
import { CodeComparison } from "@/components/magicui/code-comparison";

const beforeCode = `function greet(name) {\n  return 'Hello, ' + name + '!';\n}`;
const afterCode = `function greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}`;

const avatars = [
  { imageUrl: "https://randomuser.me/api/portraits/men/32.jpg", profileUrl: "https://randomuser.me/" },
  { imageUrl: "https://randomuser.me/api/portraits/women/44.jpg", profileUrl: "https://randomuser.me/" },
  { imageUrl: "https://randomuser.me/api/portraits/men/65.jpg", profileUrl: "https://randomuser.me/" },
  { imageUrl: "https://randomuser.me/api/portraits/women/68.jpg", profileUrl: "https://randomuser.me/" },
  { imageUrl: "https://randomuser.me/api/portraits/men/12.jpg", profileUrl: "https://randomuser.me/" },
  { imageUrl: "https://randomuser.me/api/portraits/women/25.jpg", profileUrl: "https://randomuser.me/" },
  { imageUrl: "https://randomuser.me/api/portraits/men/41.jpg", profileUrl: "https://randomuser.me/" },
  { imageUrl: "https://randomuser.me/api/portraits/women/56.jpg", profileUrl: "https://randomuser.me/" },
];

export default function LandingPage() {
  return (
    <>
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex gap-4 px-6 py-2 rounded-xl backdrop-blur bg-black/60 border border-white/10 shadow-lg transition-all duration-300 sm:top-2 sm:gap-2 sm:px-2 sm:py-1 sm:text-xs sm:rounded-lg" style={{width:'max-content'}}>
        <Link href="/" passHref legacyBehavior><RainbowButton className="sm:px-2 sm:py-1" asChild><a>Home</a></RainbowButton></Link>
        <Link href="/judge" passHref legacyBehavior><RainbowButton className="sm:px-2 sm:py-1" asChild><a>Judge</a></RainbowButton></Link>
        <Link href="/manifesto" passHref legacyBehavior><RainbowButton className="sm:px-2 sm:py-1" asChild><a>Manifesto</a></RainbowButton></Link>
        <span ><RainbowButton asChild><span className="sm:px-2 sm:py-1" role="button" tabIndex={0} onClick={() => setShowRankModal(true)}>Rank</span></RainbowButton></span>
      </nav>
      <div className="fixed inset-0 -z-20 w-full h-full bg-black" />
      <div className="fixed inset-0 -z-10 w-full h-full">
        <FlickeringGrid className="w-full h-full" color="#fff" />
      </div>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="container mx-auto px-4 py-8 flex flex-col items-center">
          <div className="w-full flex flex-col justify-center items-center mb-8">
            <AvatarCircles avatarUrls={avatars} numPeople={99} />
          </div>
          <div className="w-full flex flex-col justify-center items-center mt-32">
            <MorphingText texts={["a42z", "A for T to Z"]} className="text-white" />
            <div className="w-full flex flex-col justify-center items-center my-12">
              <CodeComparison
                beforeCode={beforeCode}
                afterCode={afterCode}
                language="tsx"
                filename="demo.tsx"
                lightTheme="github-light"
                darkTheme="github-dark"
              />
            </div>
            <div className="w-full flex flex-col justify-center items-center mt-12 relative">
              {/* Wider and more gradual gradient overlays */}
              <div className="pointer-events-none absolute left-0 top-0 h-full w-48 -translate-x-8 z-10" style={{background: 'linear-gradient(to right, black 30%, transparent 100%)'}} />
              <div className="pointer-events-none absolute right-0 top-0 h-full w-48 translate-x-8 z-10" style={{background: 'linear-gradient(to left, black 30%, transparent 100%)'}} />
              <VelocityScroll className="text-white text-2xl md:text-4xl" defaultVelocity={5} numRows={2}>
                Agentic Layer For Technical Trust In AI Era, From A to Z.
              </VelocityScroll>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 