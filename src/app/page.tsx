import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BrainCircuit, Building, Handshake, Target, Users } from 'lucide-react';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ContactForm } from '@/components/contact-form';

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-split');

const whyChooseUsPoints = [
  {
    icon: Target,
    title: 'Personalized Job Matching',
    description: 'We connect you with roles that truly match your skills and career aspirations, not just keywords.',
  },
  {
    icon: BrainCircuit,
    title: 'Career-Ready Resources',
    description: 'From resume workshops to interview prep, we provide the tools to help you stand out.',
  },
  {
    icon: Handshake,
    title: 'Direct Access to Companies',
    description: 'Get your profile directly in front of hiring managers at innovative companies looking for fresh talent.',
  },
  {
    icon: Users,
    title: 'A Supportive Community',
    description: 'Join a network that guides you on your journey, with free profile reviews and mentorship opportunities.',
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
  { id: 'testimonial-2', name: 'Priya Singh', role: 'Software Developer Intern, TechCorp', text: "As a student with no industry experience, the job market felt impossible. TAG Connect matched me with an internship that perfectly fit my skills. I'm now learning so much and building my career." },
  { id: 'testimonial-1', name: 'Ravi Kumar', role: 'Marketing Associate, AdVantage', text: "I wasn't sure how to present my college projects to employers. The profile review service was a game-changer. I landed a full-time role a month after graduating. I'm so grateful for their guidance." },
  { id: 'testimonial-3', name: 'Sameer Ahmed', role: 'HR Manager, BuildIt Construction', text: 'Finding enthusiastic, reliable young talent is always a challenge. TAG Connect provides a stream of vetted candidates who are eager to learn and grow with our company. It has transformed our entry-level hiring.' },
];


export default function Home() {
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
            <div className="relative h-80 md:h-full w-full rounded-2xl overflow-hidden shadow-2xl">
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
      
      {/* Side-by-side section: How It Works */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center">Your Path to a Great Career</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto text-center">
            A simple, guided process for both talent and businesses.
          </p>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-semibold mb-8"><Users className="text-primary"/> For Students & Workers</h3>
              <div className="relative flex flex-col gap-10">
                 <div className="absolute left-4 top-4 h-full w-px bg-border -z-10"></div>
                {howItWorksStudent.map((step, index) => (
                  <div key={index} className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold z-10">{index + 1}</div>
                    <div>
                      <h4 className="font-semibold text-lg">{step.title}</h4>
                      <p className="text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
             <div>
              <h3 className="flex items-center gap-3 text-2xl font-semibold mb-8"><Building className="text-primary"/> For Companies</h3>
              <div className="relative flex flex-col gap-10">
                <div className="absolute left-4 top-4 h-full w-px bg-border -z-10"></div>
                {howItWorksCompany.map((step, index) => (
                  <div key={index} className="flex items-start gap-5">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold z-10">{index + 1}</div>
                    <div>
                      <h4 className="font-semibold text-lg">{step.title}</h4>
                      <p className="text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric Grid for "Why Choose Us" */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="container">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-bold tracking-tight">More Than a Platform, We're Your Partner</h2>
             <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
                Your career is a journey, and we're here for every step. We believe in fostering potential and creating opportunities where students can truly grow.
             </p>
           </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUsPoints.map((point) => (
              <div key={point.title} className="bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                    <point.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg">{point.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry layout for Testimonials */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center">Success Stories</h2>
          <div className="mt-12 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {testimonials.map((testimonial) => {
              const image = PlaceHolderImages.find(p => p.id === testimonial.id);
              return (
              <div key={testimonial.name} className="break-inside-avoid">
                <Card className="bg-white dark:bg-background flex flex-col h-full">
                  <CardContent className="pt-6 flex flex-col flex-grow">
                    <p className="text-muted-foreground italic flex-grow">&quot;{testimonial.text}&quot;</p>
                    <div className="mt-4 flex items-center gap-4 border-t pt-4">
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
