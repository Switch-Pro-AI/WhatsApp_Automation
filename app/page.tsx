import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Bot,
  Users,
  Zap,
  BarChart3,
  Shield,
  ArrowRight,
  Check,
  Globe,
  Target,
  TrendingUp,
  Clock,
  Headphones,
  Languages,
  RefreshCw,
  Calendar,
  Megaphone,
  ChevronDown,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const features = [
  {
    icon: Bot,
    title: "AI-Powered WhatsApp Conversations",
    description:
      "Respond instantly to customer inquiries with intelligent, context-aware AI that understands intent and delivers relevant responses.",
  },
  {
    icon: Target,
    title: "Meta Ads Campaign Creation",
    description:
      "Create and manage Facebook and Instagram ad campaigns that send leads directly to WhatsApp conversations.",
  },
  {
    icon: Users,
    title: "Automated Lead Capture",
    description:
      "Capture leads from Meta Ads, website forms, and WhatsApp entry points automatically without manual intervention.",
  },
  {
    icon: TrendingUp,
    title: "AI Lead Qualification & Routing",
    description:
      "Ask qualifying questions, score leads, and route high-intent prospects to sales teams instantly.",
  },
  {
    icon: Zap,
    title: "Custom Chatbot Workflows",
    description:
      "Build structured conversation flows for FAQs, sales, onboarding, and support without coding.",
  },
  {
    icon: Headphones,
    title: "Human & AI Collaboration",
    description:
      "Seamlessly transfer conversations from AI to human agents when personal touch is needed.",
  },
  {
    icon: Languages,
    title: "Multi-Language Support",
    description:
      "Engage customers in multiple languages automatically with intelligent language detection.",
  },
  {
    icon: RefreshCw,
    title: "CRM & System Integrations",
    description:
      "Sync conversations and leads with CRMs, databases, and internal tools seamlessly.",
  },
  {
    icon: BarChart3,
    title: "Analytics & Conversion Tracking",
    description:
      "Track ad performance, lead quality, conversion rates, and customer engagement in real time.",
  },
  {
    icon: Clock,
    title: "Automated Follow-Ups",
    description:
      "Trigger WhatsApp messages, reminders, offers, and follow-ups to increase conversion rates.",
  },
  {
    icon: Shield,
    title: "Secure & Compliant Infrastructure",
    description:
      "Enterprise-grade security and data protection standards to keep your data safe.",
  },
  {
    icon: Globe,
    title: "Built as a Global-First Platform",
    description:
      "Scalable infrastructure, multilingual AI, and high-volume message handling for businesses worldwide.",
  },
];

const useCases = [
  {
    icon: Target,
    title: "Lead Generation & Sales Automation",
    description: "Convert Meta Ads traffic into qualified WhatsApp leads and customers automatically.",
  },
  {
    icon: Headphones,
    title: "Customer Support Automation",
    description: "Handle FAQs, order tracking, troubleshooting, and post-sales support effortlessly.",
  },
  {
    icon: Megaphone,
    title: "E-commerce & Retail",
    description: "Drive product discovery, promotions, payments, and order updates through WhatsApp.",
  },
  {
    icon: Calendar,
    title: "Appointments & Bookings",
    description: "Automate bookings, confirmations, and reminders for service-based businesses.",
  },
];

const benefits = [
  "End-to-end automation from ads to conversion",
  "Faster response times and higher lead engagement",
  "Reduced customer service and sales costs",
  "Improved conversion and retention rates",
  "Scalable AI infrastructure",
  "Full control over customer data and workflows",
];

const faqs = [
  {
    question: "Can I run Meta Ads directly from SwitchPro?",
    answer: "Yes. SwitchPro allows you to create and manage Meta Ads that connect directly to WhatsApp conversations, streamlining your entire ad-to-conversation workflow.",
  },
  {
    question: "Does the AI qualify and score leads automatically?",
    answer: "Yes. Leads are qualified based on your custom criteria before being routed or followed up. The AI asks qualifying questions and scores leads to prioritize high-intent prospects.",
  },
  {
    question: "Can I track conversions from ads to WhatsApp?",
    answer: "Yes. Track campaign performance, lead quality, and conversion metrics in one unified dashboard with real-time analytics.",
  },
  {
    question: "Can I combine AI and human agents?",
    answer: "Yes. Conversations can be handed over to human agents at any time. The system seamlessly transfers context so agents can continue conversations naturally.",
  },
  {
    question: "Is customer data secure?",
    answer: "Yes. SwitchPro follows strict data security and compliance standards with enterprise-grade encryption and protection.",
  },
];

const steps = [
  {
    number: "01",
    title: "Launch Meta Ads",
    description: "Create Facebook and Instagram campaigns that direct users to WhatsApp conversations.",
  },
  {
    number: "02",
    title: "Capture & Qualify Leads",
    description: "AI engages leads instantly, asks qualifying questions, and collects customer information.",
  },
  {
    number: "03",
    title: "Convert Through WhatsApp",
    description: "AI nurtures prospects, answers objections, schedules calls, or hands over to sales teams.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/images/frame-201.png"
                alt="SwitchPro Logo"
                width={140}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#use-cases" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Use Cases
              </a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-foreground">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                WhatsApp Customer Service AI
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              AI-Powered WhatsApp Conversations That Convert Leads Into Customers
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto text-pretty">
              SwitchPro WhatsApp Chat Agent enables businesses to automate customer conversations, 
              run Meta ad campaigns, capture leads, and convert them into paying customers using 
              AI-powered WhatsApp automation.
            </p>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Manage the full customer journey from ad click to WhatsApp conversation to conversion on a single platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 h-14">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-border bg-transparent">
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why SwitchPro Section */}
      <section className="py-16 border-y border-border bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why SwitchPro WhatsApp Chat Agent
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Globe,
                title: "Built as a Global-First Platform", 
                description: "Scalable infrastructure, multilingual AI, and high-volume message handling." 
              },
              { 
                icon: TrendingUp,
                title: "AI That Goes Beyond Support", 
                description: "Combines WhatsApp AI with Meta Ads integration to drive revenue." 
              },
              { 
                icon: BarChart3,
                title: "Reduce Costs, Increase Conversions", 
                description: "Automate lead qualification, follow-ups, and sales conversations." 
              },
              { 
                icon: Clock,
                title: "Always-On Sales and Support", 
                description: "Engage prospects and customers 24/7, even when your team is offline." 
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Core Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to automate WhatsApp conversations, capture leads, and convert customers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to transform your WhatsApp into a lead generation and conversion machine.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary/20 mb-4">{step.number}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 right-0 translate-x-1/2 w-8">
                    <ArrowRight className="h-6 w-6 text-primary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Use Cases
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              SwitchPro adapts to your business needs across various industries and use cases.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {useCases.map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">{useCase.title}</h3>
                      <p className="text-muted-foreground">{useCase.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Businesses Choose SwitchPro */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Businesses Choose SwitchPro
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border">
                  <Check className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-border">
                  <AccordionTrigger className="text-left text-foreground hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl bg-primary/10 border border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Start Turning Conversations Into Revenue
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              SwitchPro WhatsApp Chat Agent
            </p>
            <p className="text-xl text-foreground mb-8 font-medium">
              Run ads. Capture leads. Convert customers. Automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 h-14">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-border bg-transparent">
                Book a Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Custom pricing available based on ad volume, automation complexity, and integrations.
            </p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <a href="#" className="text-sm text-primary hover:underline">Compare Plans</a>
              <span className="text-muted-foreground">|</span>
              <a href="#" className="text-sm text-primary hover:underline">Contact Sales</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Image
                src="/images/frame-201.png"
                alt="SwitchPro Logo"
                width={140}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              2026 SwitchPro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
