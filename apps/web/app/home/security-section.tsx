import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Eye, FileCheck, Server, Users } from "lucide-react"

const securityFeatures = [
  {
    icon: Shield,
    title: "End-to-End Encryption",
    description: "AES-256 encryption for data at rest and in transit",
  },
  {
    icon: Lock,
    title: "Zero Trust Architecture",
    description: "Multi-factor authentication and role-based access",
  },
  {
    icon: Eye,
    title: "Comprehensive Audit Trails",
    description: "Complete visibility into all document interactions",
  },
  {
    icon: FileCheck,
    title: "Compliance Automation",
    description: "Built-in HIPAA, SOC 2, and FedRAMP compliance",
  },
  {
    icon: Server,
    title: "Private Cloud Options",
    description: "On-premises or dedicated cloud deployments",
  },
  {
    icon: Users,
    title: "Data Residency Control",
    description: "Choose where your sensitive data is stored",
  },
]

const certifications = [
  "HIPAA Compliant",
  "SOC 2 Type II",
  "FedRAMP Ready",
  "ISO 27001",
  "GDPR Compliant",
  "CCPA Compliant",
]

export function SecuritySection() {
  return (
    <section id="security" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Enterprise-Grade Security & Compliance</h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Built from the ground up with security and compliance in mind. Your sensitive data is protected by the
              same standards used by Fortune 500 companies and government agencies.
            </p>

            <div className="space-y-6 mb-8">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-4">Certifications & Compliance</h3>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <Card className="p-8 border-2 border-primary/20">
              <CardContent className="space-y-6">
                <div className="text-center">
                  <Shield className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">99.9% Uptime SLA</h3>
                  <p className="text-muted-foreground">Mission-critical reliability for your document workflows</p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">256-bit</div>
                    <div className="text-sm text-muted-foreground">Encryption</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">Monitoring</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">Zero</div>
                    <div className="text-sm text-muted-foreground">Data Breaches</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">100%</div>
                    <div className="text-sm text-muted-foreground">Compliant</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
