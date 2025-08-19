import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, CheckCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full border px-4 py-2 text-sm mb-8">
            <Shield className="mr-2 h-4 w-4 text-primary" />
            Trusted by Government & Healthcare Organizations
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Transform Your Document Processes with <span className="text-primary">AI-Powered Automation</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Streamline document ingestion, automate form completion, and submit to agencies with enterprise-grade
            security and compliance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="text-lg px-8">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              Watch Demo
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-primary" />
              HIPAA Compliant
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-primary" />
              SOC 2 Type II
            </div>
            <div className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-primary" />
              FedRAMP Ready
            </div>
            <div className="flex items-center">
              <Zap className="mr-2 h-4 w-4 text-primary" />
              99.9% Uptime SLA
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
