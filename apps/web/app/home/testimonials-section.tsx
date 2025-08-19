import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Dr. Sarah Chen",
    role: "Chief Information Officer",
    organization: "Regional Medical Center",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "DocuFlow AI has transformed our patient intake process. What used to take hours now takes minutes, and our compliance team loves the built-in audit trails.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "Digital Services Director",
    organization: "State Department of Health",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "The AI-powered form generation is incredibly accurate. We've reduced processing time by 75% while improving data quality and citizen satisfaction.",
    rating: 5,
  },
  {
    name: "Jennifer Walsh",
    role: "Operations Manager",
    organization: "County Social Services",
    avatar: "/placeholder.svg?height=40&width=40",
    content:
      "Security was our biggest concern, but DocuFlow AI exceeded all our requirements. The FedRAMP readiness gave us confidence to move forward.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Leading Organizations</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how government agencies and healthcare organizations are transforming their document workflows.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>

                <blockquote className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</blockquote>

                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4">
                    <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.organization}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
