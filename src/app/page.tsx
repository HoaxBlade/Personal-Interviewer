import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import {
  ArrowUpRight,
  CheckCircle2,
  Shield,
  Users,
  Zap,
  Brain,
  MessageSquare,
  LineChart,
  Award,
} from "lucide-react";
import { createClient } from "../../supabase/server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Prepare Like Never Before
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform simulates realistic interviews and
              provides personalized feedback to help you land your dream job.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Brain className="w-6 h-6" />,
                title: "AI-Powered Questions",
                description:
                  "Tailored questions based on job description and your experience",
              },
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Realistic Simulation",
                description:
                  "Practice with conversational AI that feels like a real interviewer",
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: "Personalized Feedback",
                description:
                  "Get actionable insights to improve your responses",
              },
              {
                icon: <LineChart className="w-6 h-6" />,
                title: "Progress Tracking",
                description:
                  "Monitor your improvement over time with detailed analytics",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from users who improved their interview performance with
              Personal Interviewer.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Software Engineer at Google",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
                quote:
                  "After practicing with Personal Interviewer for just two weeks, I felt so much more confident. The feedback helped me refine my answers and I landed my dream job!",
              },
              {
                name: "Michael Chen",
                role: "Product Manager at Microsoft",
                image:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
                quote:
                  "The realistic interview simulations were game-changing. I was able to practice answering tough questions and got valuable feedback on how to improve my responses.",
              },
              {
                name: "Priya Patel",
                role: "Data Scientist at Amazon",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=priya",
                quote:
                  "Personal Interviewer helped me identify weaknesses in my interview technique that I wasn't aware of. The personalized feedback was invaluable for my preparation.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="p-6 bg-white rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for your interview preparation
              needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Trial */}
            <div className="border border-gray-200 rounded-xl p-8 bg-white hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Free Trial</h3>
                <div className="text-3xl font-bold mb-1">$0</div>
                <div className="text-gray-500 text-sm">7 days</div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>3 practice interviews</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Basic feedback</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Limited question bank</span>
                </li>
              </ul>

              <Link
                href="/sign-up"
                className="block text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg w-full transition-colors"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Monthly */}
            <div className="border-2 border-blue-500 rounded-xl p-8 bg-white shadow-lg relative">
              <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                POPULAR
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Monthly</h3>
                <div className="text-3xl font-bold mb-1">$29</div>
                <div className="text-gray-500 text-sm">per month</div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Unlimited practice interviews</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Detailed feedback & analysis</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Full question bank access</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Progress tracking</span>
                </li>
              </ul>

              <Link
                href="/sign-up"
                className="block text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full transition-colors"
              >
                Subscribe Now
              </Link>
            </div>

            {/* Annual */}
            <div className="border border-gray-200 rounded-xl p-8 bg-white hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Annual</h3>
                <div className="text-3xl font-bold mb-1">$199</div>
                <div className="text-gray-500 text-sm">
                  per year (save $149)
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Everything in Monthly</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Early access to new features</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                  <span>Resume review</span>
                </li>
              </ul>

              <Link
                href="/sign-up"
                className="block text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg w-full transition-colors"
              >
                Subscribe Annually
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Ace Your Next Interview?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have improved their interview
            skills with Personal Interviewer.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center px-8 py-4 text-blue-600 bg-white rounded-lg hover:bg-blue-50 transition-colors font-medium"
          >
            Start Free Trial
            <ArrowUpRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
