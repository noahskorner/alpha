import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Brain, Send, Users, Workflow, Lock } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Document Ingestion",
    description:
      "Automatically convert PDFs, Word docs, and forms into structured, fillable documents with intelligent field detection.",
  },
  {
    icon: Workflow,
    title: "Smart Form Automation",
    description:
      "Generate minimal question sets that can populate multiple forms, reducing user burden while maintaining accuracy.",
  },
  {
    icon: Send,
    title: "Agency Submission",
    description:
      "Submit completed forms directly to government and healthcare agencies with built-in compliance validation.",
  },
  {
    icon: Users,
    title: "SME Review Process",
    description:
      "Built-in subject matter expert review workflows ensure accuracy and compliance before final submission.",
  },
  {
    icon: FileText,
    title: "Document Marketplace",
    description: "Access a curated library of common government and healthcare forms, ready for immediate deployment.",
  },
  {
    icon: Lock,
    title: "Enterprise Security",
    description: "End-to-end encryption, audit trails, and role-based access controls protect sensitive PII data.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Document Automation</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to streamline document workflows while maintaining the highest standards of security and
            compliance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
