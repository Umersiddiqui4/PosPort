import React from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Phone, MessageCircle, Clock, BookOpen, Users } from "lucide-react"
import { toast } from "sonner"
import "@/app/globals.css"

export default function SupportPage() {
  function screenChange(screen: string) {
    if (typeof window !== 'undefined') {
      window.location.href = `/${screen}`;
    }
  }

  // Support action handlers
  const handleEmailSupport = () => {
    window.open('mailto:support@posport.io?subject=Support Request', '_blank');
  };

  const handlePhoneSupport = () => {
    window.open('tel:+15551234567', '_blank');
  };

  const handleLiveChat = () => {
    // Show toast instead of alert
    toast.info("Live chat feature coming soon! Please use email or phone support for now.", {
      description: "We're working hard to bring you instant chat support.",
      duration: 5000,
    });
  };

  const handleFAQ = () => {
    // Redirect to FAQ page or open FAQ modal
    window.open('/faq', '_blank');
  };

  const handleDocumentation = () => {
    // Open documentation in new tab
    window.open('/docs', '_blank');
  };

  const handleCommunity = () => {
    // Redirect to community page
    window.open('/community', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
        
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Support &amp; Help</h1>
        </div>

        {/* Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Email Support */}
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg dark:text-white">Email Support</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get help via email</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Send us an email and we&apos;ll get back to you within 24 hours.
              </p>
              <Button 
                onClick={handleEmailSupport}
                className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </CardContent>
          </Card>

          {/* Phone Support */}
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg dark:text-white">Phone Support</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Call us directly</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Speak with our support team during business hours.
              </p>
              <Button 
                onClick={handlePhoneSupport}
                className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            </CardContent>
          </Card>

          {/* Live Chat */}
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <MessageCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-lg dark:text-white">Live Chat</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Chat with us online</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Get instant help through our live chat system.
              </p>
              <Button 
                onClick={handleLiveChat}
                className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Chat
              </Button>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-lg dark:text-white">FAQ</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Common questions</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Find quick answers to common questions.
              </p>
              <Button 
                onClick={handleFAQ}
                className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-600 dark:hover:bg-orange-700"
              >
                <Clock className="w-4 h-4 mr-2" />
                View FAQ
              </Button>
            </CardContent>
          </Card>

          {/* Documentation */}
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <CardTitle className="text-lg dark:text-white">Documentation</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">User guides &amp; tutorials</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Access comprehensive documentation and guides.
              </p>
              <Button 
                onClick={handleDocumentation}
                className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Docs
              </Button>
            </CardContent>
          </Card>

          {/* Community */}
          <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <CardTitle className="text-lg dark:text-white">Community</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Join our community</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Connect with other users and share experiences.
              </p>
              <Button 
                onClick={handleCommunity}
                className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
              >
                <Users className="w-4 h-4 mr-2" />
                Join Community
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="mt-12">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl dark:text-white">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                  <p className="text-gray-600 dark:text-gray-400">support@posport.io</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Phone</h3>
                  <p className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Business Hours</h3>
                  <p className="text-gray-600 dark:text-gray-400">Monday - Friday: 9:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Response Time</h3>
                  <p className="text-gray-600 dark:text-gray-400">Within 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
