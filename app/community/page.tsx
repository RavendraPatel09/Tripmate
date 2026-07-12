"use client";

import { motion } from "framer-motion";
import { MessageSquare, Heart, Share2, Image as ImageIcon, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MOCK_POSTS = [
  {
    id: 1,
    author: { name: "Alice Explorer", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704a" },
    location: "Manali, HP",
    time: "2 hours ago",
    content: "Just completed the Hampta Pass trek! The views are absolutely breathtaking. Highly recommend going in early June.",
    image: "https://images.unsplash.com/photo-1542224566-6e85f2e6772f?auto=format&fit=crop&q=80&w=1000",
    likes: 245,
    comments: 18
  },
  {
    id: 2,
    author: { name: "Foodie Traveler", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704b" },
    location: "Varanasi, UP",
    time: "5 hours ago",
    content: "Nothing beats the morning boat ride at Assi Ghat followed by some crispy Kachoris. TripMate's food guide was spot on!",
    image: null,
    likes: 120,
    comments: 5
  }
];

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Traveler Community</h1>
          <p className="text-muted-foreground mt-1">Share your stories, photos, and guides.</p>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="p-4 sm:p-6">
          <div className="flex gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <Input placeholder="Share your travel experience..." className="border-none bg-muted/50 focus-visible:ring-0 text-lg py-6" />
              <div className="flex justify-between items-center pt-2">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                  <ImageIcon className="mr-2 h-4 w-4" /> Photo/Video
                </Button>
                <Button className="rounded-full px-6">Post</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {MOCK_POSTS.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center gap-4 p-4 sm:p-6">
                <Avatar>
                  <AvatarImage src={post.author.avatar} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold">{post.author.name}</h3>
                  <div className="flex items-center text-xs text-muted-foreground gap-2">
                    <span className="flex items-center"><MapPin className="h-3 w-3 mr-0.5" /> {post.location}</span>
                    <span>•</span>
                    <span>{post.time}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 sm:px-6 py-0">
                <p className="text-sm md:text-base leading-relaxed mb-4">{post.content}</p>
                {post.image && (
                  <div className="rounded-xl overflow-hidden mb-4 border max-h-[400px]">
                    <img src={post.image} alt="Post image" className="w-full h-full object-cover" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="px-4 sm:px-6 py-4 border-t flex gap-6 text-muted-foreground">
                <button className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors group">
                  <Heart className="h-5 w-5 group-hover:fill-primary" /> {post.likes}
                </button>
                <button className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors">
                  <MessageSquare className="h-5 w-5" /> {post.comments}
                </button>
                <button className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors ml-auto">
                  <Share2 className="h-5 w-5" /> Share
                </button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
