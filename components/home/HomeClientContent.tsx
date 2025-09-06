"use client";

import { NextPage } from 'next';
import Image from 'next/image';
import { useAuth } from '@/components/auth/AuthProvider';
import { LoginModal } from '@/components/auth/LoginModal';
import { Loader2, RefreshCw, Sparkles, Trash, Coins, Upload } from 'lucide-react';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { imageGenerationSchema, type ImageGenerationFormData } from '@/lib/schemas/imageGenerationSchema';
import { uploadToR2, generateWithKie, pollKieStatus, InsufficientCreditsError } from '@/lib/client/kieClient';
import { validateFile, getAcceptedFileTypes, DEFAULT_IMAGE_VALIDATION } from '@/lib/utils/fileValidation';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FaqSection from './FaqSection'; // Import the new FaqSection component
import TestimonialsSection from './TestimonialsSection'; // Import the new TestimonialsSection component
import CtaSection from './CtaSection'; // CTA section
import ToolPreviewCarousel from './ToolPreviewCarousel';
// Extracted sections
import HeroSection from './sections/HeroSection';
import ImageShowcasesSection from './sections/ImageShowcasesSection';
import HowToUseSection from './sections/HowToUseSection';
import FeaturesSection from './sections/FeaturesSection';
import BenefitsSection from './sections/BenefitsSection';
import UserShowcaseSection from './sections/UserShowcaseSection';

 
const HomeClientContent: NextPage = () => {
  const scrollToElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const { user, signInWithOAuth } = useAuth();
  const fileInputRef = useRef(null); // This is for the minimal test
  const originalFileInputRef = useRef<HTMLInputElement>(null); // This is for the original upload area
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [slideIndex, setSlideIndex] = useState<number>(0); // used for sample showcase rotation only
  const [authError, setAuthError] = useState<string>('');
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showTopUpModal, setShowTopUpModal] = useState<boolean>(false);
  const [requiredCredits, setRequiredCredits] = useState<number | undefined>(undefined);
  const [availableCredits, setAvailableCredits] = useState<number | undefined>(undefined);
  // Force Image-to-Image workflow only
  const activeTab: 'image_to_image' = 'image_to_image';
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]); // R2 URLs
  const [uploadError, setUploadError] = useState<string>('');
  // Deferred upload states for anonymous users
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [stagedPreviews, setStagedPreviews] = useState<string[]>([]);
  // Selected quick prompt index for visual selection
  const [selectedQuickIndex, setSelectedQuickIndex] = useState<number | null>(null);

  // 使用react-hook-form管理表单状态
  const form = useForm<ImageGenerationFormData>({
    resolver: zodResolver(imageGenerationSchema),
    defaultValues: {
      prompt: '',
      model: 'pro',
    },
  });

  // Dynamic quick prompts based on active tab
  const quickPresets = useMemo(() => [
    {
      label: 'AI Miniature Classic',
      prompt: 'Transform this photo into an AI miniature scene with tilt-shift effect, shallow depth of field, enhanced colors, and miniature world appearance'
    },
    {
      label: 'Toy World Effect',
      prompt: 'Apply AI miniature transformation to create a toy-like miniature world with vibrant colors, perfect focus point, and dreamy background blur'
    },
    {
      label: 'Model Scene Style',
      prompt: 'Convert to AI miniature model scene with professional tilt-shift photography effects, sharp central focus, and artistic depth blur'
    },
    {
      label: 'Dreamy Miniature',
      prompt: 'Create soft AI miniature effect with warm tones, gentle tilt-shift blur, and enchanting miniature world atmosphere'
    },
  ], []);

  // Sample images for default showcase rotation (when no generated image)
  const sampleImages = useMemo(() => [
    '/baseball-hat-on-model.png',
    '/colleimage.jpg',
    '/change-hair-color.webp',
    '/merge.jpg'
  ], []);

  // Reset selected quick prompt when switching tabs
  useEffect(() => {
    setSelectedQuickIndex(null);
  }, []);

  // Auto-rotate showcase when no generated image and not generating
  useEffect(() => {
    if (!generatedImageUrl && !isGenerating && sampleImages.length > 1) {
      const id = setInterval(() => {
        setSlideIndex((i) => (i + 1) % sampleImages.length);
      }, 4000);
      return () => clearInterval(id);
    }
  }, [generatedImageUrl, isGenerating, sampleImages.length]);

  const handleReset = () => {
    form.reset({
      prompt: '',
      model: 'pro',
    });
    setImagePreviewUrl(null);
    setGeneratedImageUrl(null);
    setSlideIndex(0);
    setAuthError('');
    setUploadError('');
    setUploadedUrls([]);
    // clear staged anonymous selections
    setStagedFiles([]);
    setStagedPreviews([]);
    if (originalFileInputRef.current) {
      originalFileInputRef.current.value = "";
    }
    console.log('Form reset');
  };

  const onSubmit = async (data: ImageGenerationFormData) => {
    console.log('Form submitted with data:', data);
    
    // 清除之前的认证错误
    setAuthError('');
    
    // Check if user is authenticated
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const prompt = data.prompt.trim();
      if (activeTab === 'image_to_image') {
        // If not logged in, ask to login first; keep staged files
        if (!user) {
          setShowLoginModal(true);
          return;
        }
        // If user is logged in but has only staged files, upload them now (deferred upload)
        let inputImages: string[] = uploadedUrls;
        if (inputImages.length === 0 && stagedFiles.length > 0) {
          setIsUploading(true);
          const urls: string[] = [];
          for (const f of stagedFiles) {
            const sizeOk = f.size <= 5 * 1024 * 1024;
            const typeOk = ['image/jpeg','image/png','image/webp'].includes(f.type);
            if (!sizeOk || !typeOk) {
              setUploadError('Only JPEG/PNG/WEBP up to 5MB are allowed.');
              continue;
            }
            const res = await uploadToR2(f);
            if (!res.success || !res.url) {
              setUploadError(res.error || 'Upload failed');
              continue;
            }
            urls.push(res.url);
          }
          setUploadedUrls(urls);
          // clear staged after upload
          setStagedFiles([]);
          setStagedPreviews([]);
          setIsUploading(false);
          inputImages = urls;
        }
        if (inputImages.length === 0) {
          setAuthError('Please upload at least 1 image.');
          return;
        }
        const gen = await generateWithKie({ prompt, type: 'image_to_image', inputImages });
        if ('requiresPolling' in gen && gen.requiresPolling) {
          // poll for completion
          while (true) {
            await new Promise(r => setTimeout(r, 5000));
            const s = await pollKieStatus(gen.taskId);
            if (s.status === 'succeeded' && s.imageUrl) {
              setGeneratedImageUrl(s.imageUrl);
              break;
            }
            if (s.status === 'failed') {
              setAuthError(s.errorMessage || 'Image generation failed');
              break;
            }
          }
        } else {
          setGeneratedImageUrl((gen as any).imageUrl);
        }
      } else {
        const gen = await generateWithKie({ prompt, type: 'text_to_image' });
        if ('requiresPolling' in gen && gen.requiresPolling) {
          while (true) {
            await new Promise(r => setTimeout(r, 5000));
            const s = await pollKieStatus(gen.taskId);
            if (s.status === 'succeeded' && s.imageUrl) {
              setGeneratedImageUrl(s.imageUrl);
              break;
            }
            if (s.status === 'failed') {
              setAuthError(s.errorMessage || 'Image generation failed');
              break;
            }
          }
        } else {
          setGeneratedImageUrl((gen as any).imageUrl);
        }
      }
      
    } catch (error) {
      console.error('Error generating image:', error);
      if (error instanceof InsufficientCreditsError) {
        setRequiredCredits(error.required);
        setAvailableCredits(error.available);
        setShowTopUpModal(true);
        return;
      }
      setAuthError('An error occurred while generating the image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLearnMoreClick = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleGetStartedClick = async () => {
    if (!user) {
      try {
        await signInWithOAuth('google');
      } catch (error) {
        console.error('Error signing in:', error);
      }
    } else {
      console.log('User already logged in. Consider redirecting to a dashboard.');
      // Example: router.push('/dashboard'); // Would need useRouter from 'next/navigation'
    }
  };

  const handleDownloadImage = async (urlStr: string) => {
    try {
      const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(urlStr)}`;
      const response = await fetch(proxyUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `flux-kontext-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  

  return (
    <div className="min-h-screen flex flex-col relative text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <HeroSection 
        onStartCreating={() => scrollToElement('tool-area')} 
        onExploreFeatures={handleLearnMoreClick} 
      />

      {/* Tool Section - Redesigned based on screenshot */}
      <section id="tool-area" className="w-full max-w-6xl mx-auto py-12 md:py-16">
        {/* Insufficient credits modal */}
        {showTopUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card border border-border rounded-xl p-6 w-[90%] max-w-md shadow-xl">
              <h4 className="font-poppins text-lg font-semibold mb-2">Insufficient credits</h4>
              <p className="text-sm text-muted-foreground mb-4">
                You need more credits to generate images.
                {typeof requiredCredits === 'number' && typeof availableCredits === 'number' && (
                  <>
                    {' '}Required: <span className="font-medium">{requiredCredits}</span>, Available: <span className="font-medium">{availableCredits}</span>
                  </>
                )}
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowTopUpModal(false)}
                  className="px-4 py-2 rounded-md border border-border hover:bg-muted"
                >
                  Cancel
                </button>
                <a
                  href="/pricing"
                  className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Top up credits
                </a>
              </div>
            </div>
          </div>
        )}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
            Create AI Miniature Magic
          </h2>
          <p className="font-roboto text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            Transform your photos into stunning AI miniature scenes with professional tilt-shift effects. Our advanced AI miniature technology creates captivating miniature worlds from any image, making ordinary photos extraordinary with realistic depth-of-field blur and enhanced colors that bring your AI miniature vision to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
              {/* Left Column: Input Area */}
              <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg ring-1 ring-primary/20 shadow-[0_0_24px_rgba(59,130,246,0.25)] hover:shadow-[0_0_36px_rgba(59,130,246,0.35)] transition-shadow space-y-6 h-full">
                <h3 className="font-poppins text-2xl font-semibold text-foreground mb-1">Upload Your Photo</h3>
                <div className="h-px bg-border/80 -mx-6 md:-mx-8 mb-2" />
                {/* Tabs removed: Only 'Image to Image' workflow is available */}

                {/* Upload Image(s) - only for image_to_image */}
                {activeTab === 'image_to_image' && (
                  <div>
                    <label htmlFor="image-upload-input" className="font-poppins block text-sm font-medium text-foreground mb-2">
                      Upload images for AI miniature transformation <span className="text-xs text-muted-foreground">(up to 5 images)</span>
                    </label>
                    <div 
                      className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-muted rounded-lg hover:border-primary transition-colors duration-200 cursor-pointer bg-card text-card-foreground shadow-sm data-[state=active]:border-primary"
                      onClick={() => {
                        if (originalFileInputRef.current) {
                          (originalFileInputRef.current as HTMLInputElement).click();
                        }
                      }}
                    >
                      <input
                        id="image-upload-input"
                        name="image-upload-input"
                        type="file"
                        className="sr-only"
                        ref={originalFileInputRef}
                        accept={'image/jpeg,image/png,image/webp'}
                        multiple
                        onChange={(event) => {
                          setUploadError('');
                          const files = Array.from(event.target.files || []);
                          const MAX = 5;
                          const selected = files.slice(0, MAX - uploadedUrls.length);
                          if (files.length > selected.length) {
                            setUploadError(`You can upload up to ${MAX} images.`);
                          }
                          if (user) {
                            // Logged-in: upload immediately as before
                            (async () => {
                              setIsUploading(true);
                              const urls: string[] = [];
                              for (const f of selected) {
                                const sizeOk = f.size <= 5 * 1024 * 1024; // 5MB
                                const typeOk = ['image/jpeg','image/png','image/webp'].includes(f.type);
                                if (!sizeOk || !typeOk) {
                                  setUploadError('Only JPEG/PNG/WEBP up to 5MB are allowed.');
                                  continue;
                                }
                                const res = await uploadToR2(f);
                                if (!res.success || !res.url) {
                                  setUploadError(res.error || 'Upload failed');
                                  continue;
                                }
                                urls.push(res.url);
                              }
                              setUploadedUrls(prev => [...prev, ...urls].slice(0, MAX));
                              setIsUploading(false);
                            })();
                          } else {
                            // Anonymous: stage locally, no upload
                            const nextFiles: File[] = [];
                            const nextPreviews: string[] = [];
                            for (const f of selected) {
                              const sizeOk = f.size <= 5 * 1024 * 1024; // 5MB
                              const typeOk = ['image/jpeg','image/png','image/webp'].includes(f.type);
                              if (!sizeOk || !typeOk) {
                                setUploadError('Only JPEG/PNG/WEBP up to 5MB are allowed.');
                                continue;
                              }
                              nextFiles.push(f);
                              // use FileReader for data URL preview
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setStagedPreviews(prev => {
                                  const merged = [...prev, reader.result as string];
                                  return merged.slice(0, MAX);
                                });
                              };
                              reader.readAsDataURL(f);
                            }
                            setStagedFiles(prev => [...prev, ...nextFiles].slice(0, MAX));
                          }
                          // clear input element
                          if (originalFileInputRef.current) {
                            originalFileInputRef.current.value = '';
                          }
                        }}
                      />
                      {(user ? uploadedUrls.length > 0 : stagedPreviews.length > 0) ? (
                        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                          {(user ? uploadedUrls : stagedPreviews).map((u, idx) => (
                            <div key={(u as string) + idx} className="relative">
                              <img src={u as string} alt={`uploaded-${idx}`} className="w-full h-28 object-cover rounded-md border border-border" />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (user) {
                                    setUploadedUrls(prev => prev.filter((_, i) => i !== idx));
                                  } else {
                                    setStagedFiles(prev => prev.filter((_, i) => i !== idx));
                                    setStagedPreviews(prev => prev.filter((_, i) => i !== idx));
                                  }
                                }}
                                className="absolute top-1 right-1 p-1 bg-gray-700/60 text-gray-100 rounded-full hover:bg-red-500 hover:text-white"
                                aria-label="Remove"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <Upload size={48} className="mb-4 text-muted-foreground" />
                          <p className="font-semibold">Click to upload or drag and drop</p>
                          <p className="text-xs text-muted-foreground">JPEG, PNG, WEBP (max 5MB)</p>
                        </>
                      )}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        {(user ? uploadedUrls.length : stagedFiles.length)}/5 selected
                      </div>
                      <button
                        type="button"
                        onClick={() => originalFileInputRef.current?.click()}
                        className="text-xs px-2 py-1 border rounded-md hover:bg-muted"
                      >
                        Add more images
                      </button>
                    </div>
                    {uploadError && <p className="mt-2 text-xs text-red-500">{uploadError}</p>}
                    {isUploading && <p className="mt-1 text-xs text-muted-foreground">Uploading...</p>}
                  </div>
                )}

                {/* Prompt Input */}
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-poppins block text-sm font-medium text-foreground mb-2">
                        AI Miniature Style <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <textarea
                          {...field}
                          rows={4}
                          className="font-roboto shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border-border rounded-md bg-input p-3"
                          placeholder="Transform this photo into an AI miniature scene with tilt-shift effect, enhanced colors, and miniature world appearance"
                        />
                      </FormControl>
                      <FormMessage />
                      
                      {/* Quick Prompt Buttons */}
                      <div className="mt-3">
                        <p className="text-xs text-muted-foreground mb-2">Quick prompts:</p>
                        <div className="flex flex-wrap gap-2">
                          {quickPresets.map((item, index) => {
                            const isSelected = selectedQuickIndex === index;
                            return (
                              <button
                                key={index}
                                type="button"
                                aria-pressed={isSelected}
                                data-selected={isSelected || undefined}
                                onClick={() => {
                                  form.setValue('prompt', item.prompt);
                                  setSelectedQuickIndex(index);
                                }}
                                className={`px-3 py-1.5 text-xs rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-0 ${
                                  isSelected
                                    ? 'bg-primary text-primary-foreground border-transparent shadow-[0_0_12px_rgba(59,130,246,0.35)]'
                                    : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground border-border'
                                }`}
                              >
                                {item.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      
                      <FormDescription>
                        {activeTab === 'image_to_image' 
                          ? "Describe the AI miniature style and tilt-shift effects you want to apply to your photo."
                          : "Describe the AI miniature scene you want to create with tilt-shift photography effects."
                        }
                      </FormDescription>
                    </FormItem>
                  )}
                />

                {/* Removed aspect ratio and random seed fields per latest API requirements */}
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-4 pt-2">
                  {authError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-600 flex items-center">
                        <span className="text-red-500">⚠</span>
                        {authError}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="font-roboto bg-secondary text-secondary-foreground hover:bg-secondary/80 px-6 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-300 border border-border"
                    >
                      <RefreshCw size={16} className="mr-1"/> Reset
                    </button>
                    <button
                      type="submit"
                      disabled={
                        isGenerating || isUploading || (
                          activeTab === 'image_to_image' && (
                            (user ? uploadedUrls.length === 0 : stagedFiles.length === 0)
                          )
                        )
                      }
                      className={`font-roboto flex-grow px-6 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-blue-500/20 
                        ${isGenerating 
                          ? 'bg-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white hover:from-sky-600 hover:via-blue-700 hover:to-indigo-700'}
                      `}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 size={18} className="mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles size={18} className="mr-1"/> Generate (10 <Coins size={16} className="inline" />)
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Output Area */}
              <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-lg ring-1 ring-primary/20 shadow-[0_0_24px_rgba(59,130,246,0.25)] hover:shadow-[0_0_36px_rgba(59,130,246,0.35)] transition-shadow space-y-6 sticky top-24 h-full">
                <h3 className="font-poppins text-2xl font-semibold text-foreground mb-1">Output</h3>
                <div className="h-px bg-border/80 -mx-6 md:-mx-8 mb-2" />
                
                {/* Generated Image Display */}
                <div>
                  <label className="font-poppins block text-sm font-medium text-foreground mb-2">
                    Generated Image
                  </label>
                  <div className="mt-1 aspect-[4/3] w-full h-80 sm:h-72 md:h-80 lg:h-80 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center bg-muted/30 overflow-hidden relative">
                    {isGenerating ? (
                       // Loading state during image generation
                       <div className="w-full h-full flex flex-col items-center justify-center">
                        <Loader2 size={48} className="mb-4 text-primary animate-spin" />
                        <p className="text-lg font-medium text-foreground mb-2">Generating your image...</p>
                        <p className="text-sm text-muted-foreground text-center px-4">
                          This may take up to 30 seconds
                        </p>
                          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                        </div>
                    ) : generatedImageUrl ? (
                      // Show single generated image
                      <div className="w-full h-full relative group">
                        <Image 
                          src={`/api/image-proxy?url=${encodeURIComponent(generatedImageUrl)}`}
                          alt="Generated image"
                          fill
                          className="object-contain"
                        />
                        {/* Download button overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end justify-center pb-4">
                          <button
                            type="button"
                            onClick={() => generatedImageUrl && handleDownloadImage(generatedImageUrl)}
                            className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg hover:bg-primary/90 flex items-center gap-2 font-medium"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7,10 12,15 17,10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Download Image
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Default rotating showcase of sample images
                      <div className="w-full h-full relative group">
                        <Image
                          src={sampleImages[slideIndex % sampleImages.length]}
                          alt="AI image showcase"
                          fill
                          className="object-contain rounded-md"
                        />
                        {/* Navigation arrows */}
                        {sampleImages.length > 1 && (
                          <>
                            <button
                              type="button"
                              aria-label="Previous slide"
                              onClick={() => setSlideIndex((idx) => (idx - 1 + sampleImages.length) % sampleImages.length)}
                              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white shadow transition opacity-90"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              aria-label="Next slide"
                              onClick={() => setSlideIndex((idx) => (idx + 1) % sampleImages.length)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white shadow transition opacity-90"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                              </svg>
                            </button>
                          </>
                        )}
                        {/* Progress dots */}
                        {sampleImages.length > 1 && (
                          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition">
                            {sampleImages.map((_, idx) => {
                              const isActive = idx === (slideIndex % sampleImages.length);
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  aria-label={`Go to slide ${idx + 1}`}
                                  onClick={() => setSlideIndex(idx)}
                                  className={`w-2.5 h-2.5 rounded-full transition ${isActive ? 'bg-white shadow' : 'bg-white/40 hover:bg-white/60'}`}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Image actions below preview */}
                  {generatedImageUrl && !isGenerating && (
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                      <button
                        type="button"
                        onClick={() => generatedImageUrl && handleDownloadImage(generatedImageUrl)}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors duration-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7,10 12,15 17,10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                        Download Image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </section>

      {/* Image Showcase Section */}
      <ImageShowcasesSection />

      {/* How To Use Section */}
      <HowToUseSection />

      {/**
       * User Showcase Section - Temporarily hidden per request
       * Title: Banana AI Examples
       */}
      <UserShowcaseSection visible={false} />

      {/* Features Section */}
      <FeaturesSection />

      {/* Benefits Section */}
      <BenefitsSection />

      {/* Testimonials Section Component */}
      <TestimonialsSection />

      {/* FAQ Section Component */}
      <FaqSection />

      {/* CTA Section */}
      <CtaSection />

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

    </div>
  );
};

export default HomeClientContent;
