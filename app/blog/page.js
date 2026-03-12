import React from "react";
import HomePageHeader from "@/component/HomePageHeader";
import HomePageFooter from "@/component/HomePageFooter";
import Image from "next/image";

export default function Page() {
  const blogPosts = [
    {
      title: "The Science of Macros",
      date: "August 28, 2025",
      author: "Sarah Johnson",
      excerpt:
        "Understanding proteins, carbs, and fats is the foundation of building a diet that works for you. Here’s how to balance your macros for sustainable results.",
    },
    {
      title: "Meal Prep Made Simple",
      date: "August 20, 2025",
      author: "Mike Chen",
      excerpt:
        "Meal prep doesn’t have to be overwhelming. With a few smart strategies, you can save hours each week and stay consistent with your nutrition.",
    },
    {
      title: "How to Stay Consistent",
      date: "August 10, 2025",
      author: "Emily Rodriguez",
      excerpt:
        "Consistency beats perfection every time. Learn the mindset shifts and daily habits that will keep you on track long-term.",
    },
    {
      title: "Hydration Hacks for Energy",
      date: "July 30, 2025",
      author: "David Lee",
      excerpt:
        "Water plays a bigger role in performance and recovery than most people realize. Discover simple hydration tips to maximize your energy levels.",
    },
    {
      title: "Healthy Snacking on the Go",
      date: "July 25, 2025",
      author: "Rachel Adams",
      excerpt:
        "Traveling or working long hours? Learn which quick snacks keep you full and energized without derailing your nutrition goals.",
    },
    {
      title: "Protein Myths Busted",
      date: "July 18, 2025",
      author: "Chris Brown",
      excerpt:
        "Do you really need protein shakes? Can you eat too much protein? We debunk the most common myths about protein and muscle growth.",
    },
    {
      title: "Top 5 Meal Prep Mistakes",
      date: "July 10, 2025",
      author: "Sophia Patel",
      excerpt:
        "Meal prep can save time, but if done wrong it leads to wasted food and boredom. Avoid these mistakes for better results.",
    },
    {
      title: "Eating Out Without Guilt",
      date: "July 3, 2025",
      author: "James Carter",
      excerpt:
        "Yes, you can enjoy restaurant meals without ruining your diet. Learn practical strategies for making smart choices while dining out.",
    },
    {
      title: "Sleep & Nutrition Connection",
      date: "June 28, 2025",
      author: "Laura Smith",
      excerpt:
        "Poor sleep sabotages fat loss and muscle gain. Here’s how to align your nutrition with better sleep habits.",
    },
    {
      title: "Carbs: Friend or Foe?",
      date: "June 20, 2025",
      author: "Anthony Green",
      excerpt:
        "Carbs aren’t the enemy. Discover how to use carbohydrates strategically to fuel workouts and recovery.",
    },
    {
      title: "Mindful Eating Tips",
      date: "June 12, 2025",
      author: "Olivia Garcia",
      excerpt:
        "Learn how to slow down, enjoy your meals, and build a healthier relationship with food through mindful eating.",
    },
    {
      title: "Supplements That Actually Work",
      date: "June 5, 2025",
      author: "Ethan Walker",
      excerpt:
        "From protein powders to omega-3s, here’s a breakdown of which supplements are worth your money (and which aren’t).",
    },
  ];

  return (
  <>
<div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-green-50 to-blue-50 w-full">
      <HomePageHeader />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-auto">
        <div className="mx-auto max-w-[1400px] p-4 w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
            Latest Articles
          </h1>

          {/* Blog Grid (unchanged design) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {blogPosts.map((post, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm mb-4">
                    {post.date} • {post.author}
                  </p>
                  <p className="text-gray-700 mb-4">{post.excerpt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      <HomePageFooter />
      </div>

      {/* Footer */}
    </div>
</>

  );
}
