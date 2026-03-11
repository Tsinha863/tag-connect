import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Briefcase, Building, Check, Users } from 'lucide-react';

import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ContactForm } from '@/components/contact-form';

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');
const whyUsImage = PlaceHolderImages.find(p => p.id === 'why-us');

const services = [
  {
    id: 'skilled-manpower',
    title: 'Skilled Manpower Supply',
    description: 'Access our pool of pre-vetted engineers, technicians, and IT professionals ready to drive your projects forward.',
    icon: Users,
  },
  {
    id: 'unskilled-labor',
    title: 'Unskilled Labor Supply',
    description: 'Reliable and hardworking labor for construction, manufacturing, and general assistance, available on demand.',
    icon: Users,
  },
  {
    id: 'campus-recruitment',
    title: 'Campus Recruitment',
    description: 'Connect with fresh talent from top universities and colleges across the country for internships and entry-level roles.',
    icon: Users,
  },
];

const howItWorksStudent = [
  { title: 'Register & Create Profile', description: 'Sign up for free and build your professional profile in minutes.' },
  { title: 'Upload CV & Add Skills', description: 'Showcase your expertise by uploading your latest CV and highlighting your skills.' },
  { title: 'Search & Apply for Jobs', description: 'Browse thousands of jobs and apply to the ones that match your career goals.' },
  { title: 'Get Hired', description: 'Connect with top companies, attend interviews, and land your dream job.' },
];

const howItWorksCompany = [
  { title: 'Register & Create Profile', description: 'Join our platform and set up your company profile to attract top talent.' },
  { title: 'Post Job Requirements', description: 'Easily post job vacancies with detailed requirements using our simple form or AI tool.' },
  { title: 'Shortlist & Interview', description: 'Review applications, shortlist the best candidates, and manage your interview process.' },
  { title: 'Hire & Onboard', description: 'Select the perfect candidate and welcome them to your team. We handle the rest.' },
];

const whyChooseUsPoints = [
  'Verified and skilled candidates',
  'Streamlined and fast hiring process',
  'Cost-effective and affordable staffing solutions',
  'Extensive Pan-India workforce network',
  'Dedicated support for all your needs',
  'Flexible commission models (8-50% or one month salary options)',
  'Free candidate replacement within 15-30 days',
];

const testimonials = [
  { id: 'testimonial-1', name: 'Ravi Sharma', role: 'HR Manager, Tech Solutions', text: 'TAG Connect revolutionized our hiring. We found three amazing developers in just one week. The quality of candidates is exceptional.' },
  { id: 'testimonial-2', name: 'Priya Singh', role: 'Recent Graduate', text: 'As a student, finding a job was daunting. TAG Connect made it easy. I got my first job as a marketing intern through their platform!' },
  { id: 'testimonial-3', name: 'Anil Kumar', role: 'Construction Supervisor', text: 'We needed a large team for a new project on short notice. TAG Connect delivered a reliable and hardworking crew within 48 hours.' },
];

export default function Home() {
  return (
    <>
      <section className="relative bg-gradient-to-b from-background via-blue-50 to-background">
        {heroImage && (
          <div className="absolute inset-0 -z-10">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              data-ai-hint={heroImage.imageHint}
              fill
              className="object-cover opacity-5"
              priority
            />
          </div>
        )}
        <div className="container pt-16 pb-24 text-center">
          <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl tracking-tighter">
            TAG MEDIA – Trusted Manpower Provider for <span className="text-primary">Skilled & Unskilled</span> Workforce
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            Connecting companies with a verified and reliable workforce across India. From students to seasoned professionals, find the right talent for every role.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Hire Staff <ArrowRight className="ml-2" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/jobs">Find Jobs</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight">Our Services</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Comprehensive staffing solutions tailored to your business needs.
          </p>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const image = PlaceHolderImages.find(p => p.id === service.id);
              return (
              <Card key={service.id} className="text-left hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            )})}
          </div>
        </div>
      </section>
      
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center">How It Works</h2>
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-semibold mb-6"><Users className="text-primary"/> For Students / Workers</h3>
              <div className="relative flex flex-col gap-8">
                 <div className="absolute left-3.5 top-3.5 h-full w-px bg-border -z-10"></div>
                {howItWorksStudent.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold z-10">{index + 1}</div>
                    <div>
                      <h4 className="font-semibold">{step.title}</h4>
                      <p className="text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
             <div>
              <h3 className="flex items-center gap-3 text-2xl font-semibold mb-6"><Building className="text-primary"/> For Companies</h3>
              <div className="relative flex flex-col gap-8">
                <div className="absolute left-3.5 top-3.5 h-full w-px bg-border -z-10"></div>
                {howItWorksCompany.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold z-10">{index + 1}</div>
                    <div>
                      <h4 className="font-semibold">{step.title}</h4>
                      <p className="text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Why Choose TAG MEDIA?</h2>
              <p className="mt-4 text-muted-foreground">
                We are more than just a platform; we are your strategic partner in workforce management. Our commitment to quality, efficiency, and reliability sets us apart.
              </p>
              <ul className="mt-6 space-y-4">
                {whyChooseUsPoints.map((point, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-foreground">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            {whyUsImage && (
              <div className="rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={whyUsImage.imageUrl}
                  alt={whyUsImage.description}
                  data-ai-hint={whyUsImage.imageHint}
                  width={800}
                  height={600}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center">What Our Partners Say</h2>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => {
              const image = PlaceHolderImages.find(p => p.id === testimonial.id);
              return (
              <Card key={testimonial.name}>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground italic">&quot;{testimonial.text}&quot;</p>
                  <div className="mt-4 flex items-center gap-4">
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
