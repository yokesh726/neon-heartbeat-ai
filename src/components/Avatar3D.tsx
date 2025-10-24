import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Box, Cylinder, OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface AvatarCustomization {
  skinTone: string;
  eyeColor: string;
  hairStyle: string;
  hairColor: string;
  clothingColor: string;
}

interface Avatar3DProps {
  mood?: string;
  isSpeaking?: boolean;
  customization?: AvatarCustomization;
  glbUrl?: string | null;
}

// Ready Player Me Avatar Component
function ReadyPlayerMeAvatar({ url, mood, isSpeaking }: { url: string; mood: string; isSpeaking: boolean }) {
  const { scene } = useGLTF(url);
  const avatarRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (avatarRef.current) {
      // Apply mood-based animations to the loaded model
      const rotationY = mood === "excited" ? Math.sin(Date.now() * 0.003) * 0.1 : 0;
      avatarRef.current.rotation.y = rotationY;
      
      // Speaking animation
      if (isSpeaking) {
        avatarRef.current.position.y = Math.sin(Date.now() * 0.01) * 0.02;
      }
    }
  });

  return (
    <primitive 
      ref={avatarRef}
      object={scene} 
      scale={2} 
      position={[0, -1.5, 0]} 
    />
  );
}

const defaultCustomization: AvatarCustomization = {
  skinTone: "#f5d5b8",
  eyeColor: "#4a90e2",
  hairStyle: "short",
  hairColor: "#4a3728",
  clothingColor: "#667eea",
};

function AvatarHead({ 
  mood = "neutral", 
  isSpeaking = false,
  customization 
}: { 
  mood: string; 
  isSpeaking: boolean;
  customization: AvatarCustomization;
}) {
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  
  // Animation based on mood
  const moodAnimation = useMemo(() => {
    switch (mood) {
      case "happy":
        return { headRotation: 0.1, eyeScale: 1.2, mouthScale: 1.3 };
      case "sad":
        return { headRotation: -0.15, eyeScale: 0.8, mouthScale: 0.7 };
      case "excited":
        return { headRotation: 0.2, eyeScale: 1.4, mouthScale: 1.5 };
      case "calm":
        return { headRotation: 0, eyeScale: 1, mouthScale: 1 };
      default:
        return { headRotation: 0, eyeScale: 1, mouthScale: 1 };
    }
  }, [mood]);

  useFrame((state) => {
    if (!headRef.current) return;
    
    // Breathing animation
    const breathingOffset = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    headRef.current.position.y = 0.5 + breathingOffset;
    
    // Head tilt based on mood
    headRef.current.rotation.z = THREE.MathUtils.lerp(
      headRef.current.rotation.z,
      moodAnimation.headRotation,
      0.05
    );
    
    // Speaking animation
    if (isSpeaking && mouthRef.current) {
      const speakingOffset = Math.sin(state.clock.elapsedTime * 10) * 0.1 + 0.1;
      mouthRef.current.scale.y = 0.3 + speakingOffset;
    } else if (mouthRef.current) {
      mouthRef.current.scale.y = THREE.MathUtils.lerp(
        mouthRef.current.scale.y,
        moodAnimation.mouthScale * 0.3,
        0.1
      );
    }
    
    // Blinking
    if (leftEyeRef.current && rightEyeRef.current) {
      const blinkTime = Math.floor(state.clock.elapsedTime * 2) % 5;
      if (blinkTime < 0.2) {
        leftEyeRef.current.scale.y = 0.1;
        rightEyeRef.current.scale.y = 0.1;
      } else {
        leftEyeRef.current.scale.y = THREE.MathUtils.lerp(
          leftEyeRef.current.scale.y,
          moodAnimation.eyeScale,
          0.2
        );
        rightEyeRef.current.scale.y = THREE.MathUtils.lerp(
          rightEyeRef.current.scale.y,
          moodAnimation.eyeScale,
          0.2
        );
      }
    }
  });

  return (
    <group ref={headRef}>
      {/* Head */}
      <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color={customization.skinTone} />
      </Sphere>
      
      {/* Eyes */}
      <Sphere ref={leftEyeRef} args={[0.08, 16, 16]} position={[-0.15, 0.1, 0.4]}>
        <meshStandardMaterial color={customization.eyeColor} />
      </Sphere>
      <Sphere ref={rightEyeRef} args={[0.08, 16, 16]} position={[0.15, 0.1, 0.4]}>
        <meshStandardMaterial color={customization.eyeColor} />
      </Sphere>
      
      {/* Mouth */}
      <Box ref={mouthRef} args={[0.25, 0.08, 0.05]} position={[0, -0.15, 0.4]}>
        <meshStandardMaterial color="#ff6b9d" />
      </Box>
      
      {/* Hair */}
      {customization.hairStyle === "short" && (
        <Sphere args={[0.52, 32, 32]} position={[0, 0.2, 0]}>
          <meshStandardMaterial color={customization.hairColor} />
        </Sphere>
      )}
      
      {customization.hairStyle === "long" && (
        <>
          <Sphere args={[0.52, 32, 32]} position={[0, 0.2, 0]}>
            <meshStandardMaterial color={customization.hairColor} />
          </Sphere>
          <Box args={[0.6, 0.8, 0.3]} position={[0, -0.3, -0.2]}>
            <meshStandardMaterial color={customization.hairColor} />
          </Box>
        </>
      )}
    </group>
  );
}

function AvatarBody({ customization }: { customization: AvatarCustomization }) {
  const bodyRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!bodyRef.current) return;
    const breathingOffset = Math.sin(state.clock.elapsedTime * 2) * 0.01;
    bodyRef.current.scale.y = 1 + breathingOffset;
  });

  return (
    <group ref={bodyRef} position={[0, -0.5, 0]}>
      {/* Torso */}
      <Cylinder args={[0.35, 0.4, 0.8, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color={customization.clothingColor} />
      </Cylinder>
      
      {/* Neck */}
      <Cylinder args={[0.15, 0.15, 0.2, 16]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color={customization.skinTone} />
      </Cylinder>
    </group>
  );
}

function AvatarCharacter({ 
  mood = "neutral", 
  isSpeaking = false,
  customization
}: { 
  mood: string; 
  isSpeaking: boolean;
  customization: AvatarCustomization;
}) {
  return (
    <>
      <AvatarHead 
        mood={mood} 
        isSpeaking={isSpeaking}
        customization={customization}
      />
      <AvatarBody customization={customization} />
    </>
  );
}

export default function Avatar3D({ 
  mood = "neutral", 
  isSpeaking = false,
  customization,
  glbUrl
}: Avatar3DProps) {
  const finalCustomization = { ...defaultCustomization, ...customization };

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#b794f6" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4fd1c5" />
        <pointLight position={[0, 0, 5]} intensity={0.8} color="#f687b3" />
        
        <Suspense fallback={null}>
          {glbUrl ? (
            <ReadyPlayerMeAvatar url={glbUrl} mood={mood} isSpeaking={isSpeaking} />
          ) : (
            <AvatarCharacter 
              mood={mood} 
              isSpeaking={isSpeaking}
              customization={finalCustomization}
            />
          )}
        </Suspense>
        
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
