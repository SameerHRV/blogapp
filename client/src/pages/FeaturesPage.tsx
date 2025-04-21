import React from "react";
import BlogLayout from "@/components/BlogLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  PenTool,
  Image,
  Search,
  BarChart,
  Share2,
  Smartphone,
  Shield,
  Zap,
  Check,
  Layers,
  Palette,
} from "lucide-react";

const FeaturesPage: React.FC = () => {
  return (
    <BlogLayout>
      <div className="blog-container py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features for Modern Bloggers</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to create, manage, and grow your blog in one beautiful platform.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <PenTool className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Rich Text Editor</h3>
                <p className="text-muted-foreground">
                  Our intuitive editor supports markdown, rich text formatting, and seamless image uploads to help you create beautiful content.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Media Management</h3>
                <p className="text-muted-foreground">
                  Easily upload, organize, and optimize images and videos to enhance your blog posts and engage your readers.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">SEO Optimization</h3>
                <p className="text-muted-foreground">
                  Built-in SEO tools help you optimize your content for search engines and drive more traffic to your blog.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">
                  Track your blog's performance with detailed analytics on views, engagement, and audience demographics.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Share2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Social Sharing</h3>
                <p className="text-muted-foreground">
                  Seamlessly share your content across social media platforms and grow your audience with integrated sharing tools.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Mobile Responsive</h3>
                <p className="text-muted-foreground">
                  Your blog looks great on any device, ensuring a seamless experience for all your readers.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="bg-muted/30 rounded-lg p-8 mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Advanced Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border rounded-lg p-6 hover-card-scale">
              <Shield className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Security</h3>
              <p className="text-muted-foreground mb-4">
                Enterprise-grade security to protect your content and user data.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span>Two-factor authentication</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span>Automated backups</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span>SSL encryption</span>
                </li>
              </ul>
            </div>
            <div className="bg-card border rounded-lg p-6 hover-card-scale">
              <Zap className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Performance</h3>
              <p className="text-muted-foreground mb-4">
                Lightning-fast loading times and optimized content delivery.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span>Global CDN</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span>Image optimization</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span>Lazy loading</span>
                </li>
              </ul>
            </div>
            <div className="bg-card border rounded-lg p-6 hover-card-scale">
              <Layers className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Customization</h3>
              <p className="text-muted-foreground mb-4">
                Tailor your blog to match your brand and style preferences.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span>Custom themes</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span>CSS customization</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-4 w-4 text-primary mr-2" />
                  <span>Layout options</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">How We Compare</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-4 text-left font-bold">Features</th>
                  <th className="p-4 text-center font-bold">Blogger App</th>
                  <th className="p-4 text-center font-bold">Competitors</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-medium">Rich Text Editor</td>
                  <td className="p-4 text-center text-primary"><Check className="h-5 w-5 mx-auto" /></td>
                  <td className="p-4 text-center text-primary"><Check className="h-5 w-5 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">SEO Optimization</td>
                  <td className="p-4 text-center text-primary"><Check className="h-5 w-5 mx-auto" /></td>
                  <td className="p-4 text-center text-primary"><Check className="h-5 w-5 mx-auto" /></td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Analytics Dashboard</td>
                  <td className="p-4 text-center text-primary"><Check className="h-5 w-5 mx-auto" /></td>
                  <td className="p-4 text-center text-muted-foreground">Limited</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Custom Themes</td>
                  <td className="p-4 text-center text-primary"><Check className="h-5 w-5 mx-auto" /></td>
                  <td className="p-4 text-center text-muted-foreground">Premium Only</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-medium">Mobile Responsive</td>
                  <td className="p-4 text-center text-primary"><Check className="h-5 w-5 mx-auto" /></td>
                  <td className="p-4 text-center text-primary"><Check className="h-5 w-5 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-medium">Free Plan</td>
                  <td className="p-4 text-center text-primary"><Check className="h-5 w-5 mx-auto" /></td>
                  <td className="p-4 text-center text-muted-foreground">Limited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Customization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="bg-gradient-to-br from-primary/20 to-accent-blue/30 rounded-lg p-8 h-80 flex items-center justify-center">
            <div className="text-center">
              <Palette className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-bold mb-2">Endless Customization</h3>
              <p className="text-muted-foreground">
                Make your blog truly yours with our powerful customization tools.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Your Blog, Your Way</h2>
            <p className="text-lg text-muted-foreground mb-4">
              We believe that your blog should reflect your unique style and brand. That's why we've built powerful customization tools that give you complete control over how your blog looks and feels.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              From custom themes and layouts to personalized typography and color schemes, you have the freedom to create a blog that's truly yours.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              And with our intuitive drag-and-drop interface, you don't need any coding skills to create a professional-looking blog.
            </p>
            <Link to="/register">
              <Button className="group">
                Start Customizing
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of bloggers who are already using Blogger App to create beautiful, engaging content.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">Sign Up Free</Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">Contact Sales</Button>
            </Link>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
};

export default FeaturesPage;
