import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Handshake, Target, HeartHandshake, Quote } from 'lucide-react';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ContactForm } from '@/components/contact-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';


const heroImage = PlaceHolderImages.find(p => p.id === 'hero-split');
const storyImage = PlaceHolderImages.find(p => p.id === 'our-story');

const whyChooseUsPoints = [
  {
    icon: Target,
    title: 'Precision Matching',
    description: 'We go beyond keywords. Our team gets to know you and connects you with roles that align with your true skills and long-term career goals.',
    featured: true,
  },
  {
    icon: Sparkles,
    title: 'Polish Your Potential',
    description: 'From resume feedback to mock interviews, we provide the resources and expert guidance you need to stand out from the crowd.',
  },
  {
    icon: Handshake,
    title: 'Direct Connections',
    description: 'No more black holes. We get your profile in front of real hiring managers at companies that are actively seeking fresh talent.',
  },
  {
    icon: HeartHandshake,
    title: 'A Partner in Your Corner',
    description: 'This is more than a platform. Join a community that offers mentorship, support, and guidance every step of your journey.',
  },
];


const howItWorksStudent = [
  { title: 'Create Your Showcase', description: 'Sign up for free and build a dynamic profile that highlights your skills, projects, and ambitions.' },
  { title: 'Discover Opportunities', description: 'Browse jobs and internships specifically curated for students and recent graduates.' },
  { title: 'Get Expert Guidance', description: 'Our team provides feedback and support to help you navigate the application process.' },
  { title: 'Land Your Dream Job', description: 'Connect with top companies, ace your interviews, and kickstart your professional journey.' },
];

const howItWorksCompany = [
  { title: 'Tell Us Your Needs', description: 'Join our platform and post your job requirements. We cater to roles from internships to full-time positions.' },
  { title: 'Meet Vetted Candidates', description: 'Access a pipeline of ambitious, pre-screened students and workers ready to make an impact.' },
  { title: 'Hire with Confidence', description: 'Review profiles, shortlist the best fits, and build your team with the next generation of talent.' },
  { title: 'Grow Your Team', description: 'Onboard your new hire and watch them grow. We believe in fostering long-term partnerships.' },
];

const testimonials = [
    { id: 'testimonial-2', name: 'Anjali Desai', role: 'Engineering Intern, Spark Innovations', text: "The team at TAG didn't just find me a job, they found me a mentor. The internship they placed me in has been the most valuable experience of my education. I'm finally applying what I learned in class to real-world projects." },
    { id: 'testimonial-1', name: 'Vikram Patel', role: 'Junior Accountant', text: "I uploaded my CV and within a week, I had two interviews lined up with companies I actually wanted to work for. TAG's team helped me prep for the interviews and gave me the confidence I needed to land my first full-time role." },
    { id: 'testimonial-3', name: 'Meera Sharma', role: 'HR Director, Fusion Logistics', text: "We used to spend weeks sifting through applications for entry-level positions. With TAG Connect, we get a curated list of motivated, pre-vetted candidates. We've hired three people through their platform, and the quality of talent is exceptional. It's been a huge time-saver for our HR department." },
];


export default function Home() {
  const featuredPoint = whyChooseUsPoints.find(p => p.featured);
  const otherPoints = whyChooseUsPoints.filter(p => !p.featured);

  return (
    <>
      {/* Split Hero Section */}
      <section className="container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl tracking-tighter">
              From Classroom to Career,<br /> Your Journey Starts <span className="text-primary">Here</span>.
            </h1>
            <p className="mt-6 max-w-xl mx-auto md:mx-0 text-lg text-muted-foreground">
              We don't just find you a job; we help you build a future. TAG Connect is your partner in launching a successful career, connecting you with companies that nurture and invest in emerging talent.
            </p>
            <div className="mt-8 flex justify-center md:justify-start gap-4">
              <Button size="lg" asChild>
                <Link href="/jobs">Find My First Job <ArrowRight className="ml-2" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/signup">Hire Future Talent</Link>
              </Button>
            </div>
          </div>
          {heroImage && (
            <div className="relative h-80 md:h-[450px] w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                data-ai-hint={heroImage.imageHint}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {storyImage && (
              <div className="relative h-80 md:h-[450px] w-full rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src={storyImage.imageUrl}
                  alt={storyImage.description}
                  data-ai-hint={storyImage.imageHint}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="text-center md:text-left md:pl-8">
              <p className="text-primary font-semibold tracking-wide uppercase">Our Story</p>
              <h2 className="font-bold text-3xl md:text-4xl mt-2 tracking-tight">
                Born from a simple belief: Potential is everywhere.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                It all started on a local college campus. We saw firsthand how hard it was for bright, ambitious students to get noticed by the right companies. Their potential was immense, but their resumes often got lost in the pile. At the same time, we knew local businesses were desperate for fresh talent but didn't have an easy way to find it.
                <br/><br/>
                That's when TAG Connect was born. We're not a faceless corporation; we're a team of mentors and connectors who live and breathe this community. Our mission is simple: to give every student a real shot at a great career and to help companies build their future with the best local talent. We believe in handshakes, not just clicks.
              </p>
              <p className="mt-6 font-semibold text-muted-foreground">- From the founders of TAG Connect</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Asymmetric Grid for "Our Promise" */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold tracking-tight">Our Promise to You</h2>
             <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                Your career is a journey, and we're here for every step. We believe in fostering potential and creating opportunities where students can truly grow.
             </p>
           </div>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {featuredPoint && (
                <Card className="lg:col-span-2 p-8 bg-primary/5 dark:bg-primary/10 border-primary/20">
                     <div className="w-16 h-16 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                        <featuredPoint.icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-2xl">{featuredPoint.title}</h3>
                    <p className="text-muted-foreground mt-2 text-base">{featuredPoint.description}</p>
                </Card>
            )}
            <div className="grid gap-8">
                {otherPoints.map((point) => (
                <div key={point.title} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <point.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{point.title}</h3>
                        <p className="text-muted-foreground mt-1 text-sm">{point.description}</p>
                    </div>
                </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Side-by-side section with Tabs: How It Works */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center">A Simple Path to Success</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto text-center">
            A clear, guided process for both emerging talent and innovative businesses.
          </p>
          <Tabs defaultValue="students" className="mt-12 max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="students">For Students & Workers</TabsTrigger>
              <TabsTrigger value="companies">For Companies</TabsTrigger>
            </TabsList>
            <TabsContent value="students">
              <Card>
                <CardContent className="p-6">
                  <div className="relative flex flex-col gap-8">
                    {howItWorksStudent.map((step, index) => (
                      <div key={index} className="flex items-start gap-5">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold z-10 text-lg">{index + 1}</div>
                        <div>
                          <h4 className="font-semibold text-lg">{step.title}</h4>
                          <p className="text-muted-foreground mt-1">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="companies">
                <Card>
                    <CardContent className="p-6">
                        <div className="relative flex flex-col gap-8">
                            {howItWorksCompany.map((step, index) => (
                            <div key={index} className="flex items-start gap-5">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold z-10 text-lg">{index + 1}</div>
                                <div>
                                <h4 className="font-semibold text-lg">{step.title}</h4>
                                <p className="text-muted-foreground mt-1">{step.description}</p>
                                </div>
                            </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Masonry layout for Testimonials */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center">Success Stories</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto text-center">
            Hear from those who have successfully started their journey with us.
          </p>
          <div className="mt-12 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {testimonials.map((testimonial) => {
              const image = PlaceHolderImages.find(p => p.id === testimonial.id);
              return (
              <div key={testimonial.name} className="break-inside-avoid">
                <Card className="bg-white dark:bg-background flex flex-col h-full">
                  <CardContent className="pt-6 flex flex-col flex-grow">
                    <Quote className="w-8 h-8 text-primary/30 mb-4" />
                    <p className="text-muted-foreground italic flex-grow">&quot;{testimonial.text}&quot;</p>
                    <div className="mt-6 flex items-center gap-4 border-t pt-6">
                      {image && (
                        <Avatar>
                          <AvatarImage src={image.imageUrl} alt={testimonial.name} data-ai-hint={image.imageHint} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )})}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
