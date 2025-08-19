import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star } from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for small teams getting started",
    features: [
      "Up to 10 documents per month",
      "Basic AI form generation",
      "Standard security features",
      "Email support",
      "Community access",
    ],
    limitations: ["No agency submission", "Limited integrations"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pay as You Go",
    price: "$0.50",
    period: "per document",
    description: "Scale with your usage, no monthly commitments",
    features: [
      "Unlimited documents",
      "Advanced AI processing",
      "Agency submission included",
      "Priority support",
      "All integrations",
      "Custom workflows",
      "Audit trails",
    ],
    limitations: [],
    cta: "Start Processing",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large organizations with specific needs",
    features: [
      "Volume discounts",
      "Dedicated infrastructure",
      "Custom compliance requirements",
      "White-label options",
      "Dedicated success manager",
      "SLA guarantees",
      "On-premises deployment",
      "Custom integrations",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your organization's needs. Start free and scale as you grow.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : "border-border"}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-1">/{plan.period}</span>
                </div>
                <CardDescription className="mt-4 text-base">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <li key={limitationIndex} className="flex items-start text-muted-foreground">
                      <span className="mr-3 mt-0.5">×</span>
                      <span className="text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full" variant={plan.popular ? "default" : "outline"} size="lg">
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            All plans include our core security features and compliance standards
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-2" />
              HIPAA Compliant
            </span>
            <span className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-2" />
              SOC 2 Type II
            </span>
            <span className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-2" />
              99.9% Uptime SLA
            </span>
            <span className="flex items-center">
              <Check className="h-4 w-4 text-primary mr-2" />
              24/7 Support
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
