// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
"use client";
import React, { useState, useEffect } from 'react';
import { useTheme } from "next-themes";
import { format } from 'date-fns';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import * as echarts from 'echarts';

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

// Blog data
const blogPosts = [
  {
    id: 1,
    title: "The Art of Mindful Writing: Finding Your Voice in a Noisy World",
    excerpt: "Discover how mindfulness practices can enhance your writing process and help you develop a unique voice that resonates with readers.",
    category: "Writing",
    date: "2025-05-28",
    readTime: 8,
    image: "https://readdy.ai/api/search-image?query=a%20professional%20writer%20working%20in%20a%20peaceful%20minimalist%20office%20with%20natural%20light%2C%20plants%2C%20and%20a%20laptop%2C%20soft%20morning%20light%20streaming%20through%20windows%2C%20calm%20atmosphere%2C%20high%20quality%20professional%20photography&width=800&height=500&seq=1&orientation=landscape",
    author: "Emma Johnson",
    likes: 124,
    comments: 32,
    featured: true
  },
  {
    id: 2,
    title: "Sustainable Travel: Exploring the World While Protecting It",
    excerpt: "Learn practical tips for reducing your environmental impact while traveling and discover eco-friendly destinations around the globe.",
    category: "Travel",
    date: "2025-05-25",
    readTime: 6,
    image: "https://readdy.ai/api/search-image?query=a%20breathtaking%20landscape%20with%20mountains%20and%20clear%20water%2C%20showing%20pristine%20nature%20with%20sustainable%20travel%20elements%2C%20backpack%20and%20reusable%20water%20bottle%20visible%2C%20soft%20natural%20lighting%2C%20professional%20travel%20photography&width=800&height=500&seq=2&orientation=landscape",
    author: "Emma Johnson",
    likes: 98,
    comments: 24,
    featured: false
  },
  {
    id: 3,
    title: "Digital Minimalism: Reclaiming Your Focus in an Age of Distraction",
    excerpt: "How to implement digital minimalism principles to improve productivity, mental health, and reclaim your attention from technology.",
    category: "Lifestyle",
    date: "2025-05-22",
    readTime: 5,
    image: "https://readdy.ai/api/search-image?query=a%20clean%20minimalist%20desk%20setup%20with%20only%20essential%20items%2C%20a%20single%20notebook%2C%20plant%2C%20and%20turned%20off%20smartphone%2C%20natural%20light%2C%20calm%20atmosphere%2C%20professional%20photography%20with%20soft%20lighting&width=800&height=500&seq=3&orientation=landscape",
    author: "Emma Johnson",
    likes: 156,
    comments: 41,
    featured: false
  },
  {
    id: 4,
    title: "The Science of Habit Formation: How to Build Lasting Change",
    excerpt: "Explore the neuroscience behind habit formation and learn evidence-based strategies for creating positive habits that stick.",
    category: "Psychology",
    date: "2025-05-20",
    readTime: 7,
    image: "https://readdy.ai/api/search-image?query=a%20person%20writing%20in%20a%20habit%20tracker%20journal%20with%20a%20cup%20of%20tea%20nearby%2C%20morning%20routine%20visualization%2C%20soft%20natural%20lighting%20through%20window%2C%20clean%20modern%20aesthetic%2C%20professional%20lifestyle%20photography&width=800&height=500&seq=4&orientation=landscape",
    author: "Emma Johnson",
    likes: 87,
    comments: 19,
    featured: false
  },
  {
    id: 5,
    title: "Creative Cooking: Reinventing Classic Recipes with Modern Twists",
    excerpt: "Discover how to breathe new life into traditional recipes by incorporating unexpected ingredients and contemporary cooking techniques.",
    category: "Food",
    date: "2025-05-18",
    readTime: 4,
    image: "https://readdy.ai/api/search-image?query=a%20beautifully%20plated%20modern%20dish%20with%20artistic%20presentation%2C%20vibrant%20colors%2C%20on%20a%20minimalist%20ceramic%20plate%2C%20professional%20food%20photography%20with%20soft%20natural%20lighting%2C%20clean%20background&width=800&height=500&seq=5&orientation=landscape",
    author: "Emma Johnson",
    likes: 112,
    comments: 28,
    featured: false
  },
  {
    id: 6,
    title: "The Future of Remote Work: Navigating the New Normal",
    excerpt: "Insights into how remote work is evolving and practical strategies for thriving in distributed teams and digital workplaces.",
    category: "Career",
    date: "2025-05-15",
    readTime: 6,
    image: "https://readdy.ai/api/search-image?query=a%20modern%20home%20office%20setup%20with%20ergonomic%20chair%2C%20laptop%2C%20plants%2C%20and%20large%20windows%2C%20natural%20light%20streaming%20in%2C%20clean%20aesthetic%2C%20professional%20interior%20photography%20with%20soft%20lighting&width=800&height=500&seq=6&orientation=landscape",
    author: "Emma Johnson",
    likes: 134,
    comments: 37,
    featured: false
  }
];

const categories = [
  { name: "Writing", icon: "fa-pen-fancy", count: 12 },
  { name: "Travel", icon: "fa-plane", count: 8 },
  { name: "Lifestyle", icon: "fa-leaf", count: 15 },
  { name: "Psychology", icon: "fa-brain", count: 9 },
  { name: "Food", icon: "fa-utensils", count: 11 },
  { name: "Career", icon: "fa-briefcase", count: 7 },
  { name: "Technology", icon: "fa-laptop-code", count: 14 },
  { name: "Health", icon: "fa-heartbeat", count: 10 }
];

const popularPosts = [
  {
    id: 101,
    title: "10 Essential Writing Habits of Successful Authors",
    date: "2025-04-15",
    image: "https://readdy.ai/api/search-image?query=a%20writer%20working%20at%20a%20beautiful%20desk%20with%20notebooks%20and%20coffee%2C%20soft%20morning%20light%2C%20productive%20atmosphere%2C%20clean%20aesthetic%2C%20professional%20photography%20with%20natural%20lighting&width=400&height=300&seq=7&orientation=landscape",
    views: 3245
  },
  {
    id: 102,
    title: "How to Create a Sustainable Morning Routine",
    date: "2025-04-02",
    image: "https://readdy.ai/api/search-image?query=a%20peaceful%20morning%20scene%20with%20journal%2C%20tea%2C%20and%20meditation%20cushion%2C%20soft%20sunrise%20light%20through%20windows%2C%20calm%20atmosphere%2C%20clean%20aesthetic%2C%20professional%20lifestyle%20photography&width=400&height=300&seq=8&orientation=landscape",
    views: 2876
  },
  {
    id: 103,
    title: "The Psychology of Decision Making",
    date: "2025-03-20",
    image: "https://readdy.ai/api/search-image?query=a%20person%20contemplating%20at%20a%20crossroads%20or%20making%20a%20choice%2C%20symbolic%20representation%20of%20decision%20making%2C%20soft%20natural%20lighting%2C%20clean%20aesthetic%2C%20professional%20conceptual%20photography&width=400&height=300&seq=9&orientation=landscape",
    views: 2543
  }
];

const App: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  
  // Handle scroll for progress bar and sticky nav
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.body.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      
      setIsNavSticky(window.scrollY > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Initialize analytics chart
  useEffect(() => {
    const chartDom = document.getElementById('analytics-chart');
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        animation: false,
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Page Views',
            type: 'line',
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#8884d8'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(136, 132, 216, 0.4)'
                }, {
                  offset: 1, color: 'rgba(136, 132, 216, 0.1)'
                }]
              }
            }
          }
        ]
      };
      myChart.setOption(option);
      
      const handleResize = () => {
        myChart.resize();
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'MMMM d, yyyy');
  };
  
  const featuredPost = blogPosts.find(post => post.featured);
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50">
        <div 
          className="h-full bg-purple-600" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>
      
      {/* Header */}
      <header className={`w-full bg-white dark:bg-gray-950 transition-all duration-300 ${isNavSticky ? 'shadow-md fixed top-0 z-40' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <div className="flex items-center">
              <a href="#" className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Emma Johnson</span>
              </a>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium">Home</a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium">About</a>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium cursor-pointer flex items-center">
                    Blog <i className="fas fa-chevron-down ml-1 text-xs"></i>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.name} className="cursor-pointer">
                      <i className={`fas ${category.icon} mr-2 text-purple-500`}></i>
                      {category.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium">Portfolio</a>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium">Contact</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer"
                aria-label="Search"
              >
                <i className="fas fa-search text-lg"></i>
              </button>
              
              <button 
                onClick={toggleTheme}
                className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <i className="fas fa-sun text-lg"></i>
                ) : (
                  <i className="fas fa-moon text-lg"></i>
                )}
              </button>
              
              <div className="hidden md:flex space-x-3">
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400" aria-label="Twitter">
                  <i className="fab fa-twitter text-lg"></i>
                </a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400" aria-label="Instagram">
                  <i className="fab fa-instagram text-lg"></i>
                </a>
                <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400" aria-label="LinkedIn">
                  <i className="fab fa-linkedin text-lg"></i>
                </a>
              </div>
              
              <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <SheetContent side="top" className="h-1/2">
                  <SheetHeader className="mb-6">
                    <SheetTitle>Search</SheetTitle>
                    <SheetDescription>
                      Find articles, stories, and insights
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex w-full max-w-3xl mx-auto mb-8">
                    <Input
                      type="text"
                      placeholder="Search for articles, topics, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 text-base border-gray-300 dark:border-gray-700 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <Button className="ml-2 bg-purple-600 hover:bg-purple-700 !rounded-button whitespace-nowrap">
                      <i className="fas fa-search mr-2"></i> Search
                    </Button>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Popular searches</h3>
                    <div className="flex flex-wrap gap-2">
                      {["writing tips", "mindfulness", "productivity", "travel", "food recipes", "career advice"].map((tag) => (
                        <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Filter by category</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {categories.slice(0, 8).map((category) => (
                        <Button key={category.name} variant="outline" className="justify-start !rounded-button whitespace-nowrap">
                          <i className={`fas ${category.icon} mr-2 text-purple-500`}></i>
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden !rounded-button whitespace-nowrap">
                    <i className="fas fa-bars text-lg"></i>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4 mt-6">
                    <a href="#" className="text-lg font-medium">Home</a>
                    <a href="#" className="text-lg font-medium">About</a>
                    <a href="#" className="text-lg font-medium">Blog</a>
                    <a href="#" className="text-lg font-medium">Portfolio</a>
                    <a href="#" className="text-lg font-medium">Contact</a>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex space-x-4">
                      <a href="#" aria-label="Twitter">
                        <i className="fab fa-twitter text-xl"></i>
                      </a>
                      <a href="#" aria-label="Instagram">
                        <i className="fab fa-instagram text-xl"></i>
                      </a>
                      <a href="#" aria-label="LinkedIn">
                        <i className="fab fa-linkedin text-xl"></i>
                      </a>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <Switch id="theme-toggle-mobile" checked={theme === "dark"} onCheckedChange={toggleTheme} />
                      <Label htmlFor="theme-toggle-mobile">Dark Mode</Label>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {/* Hero Section */}
        <section className="relative rounded-2xl overflow-hidden mb-16 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-gray-900 dark:to-purple-950">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 z-10">
              {featuredPost && (
                <>
                  <Badge className="mb-4 bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 hover:bg-purple-200 dark:hover:bg-purple-800 cursor-pointer">
                    {featuredPost.category}
                  </Badge>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                    {featuredPost.title}
                  </h1>
                  <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center mb-6">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20female%20writer%20with%20thoughtful%20expression%2C%20neutral%20background%2C%20soft%20lighting%2C%20high%20quality%20portrait%20photography&width=100&height=100&seq=10&orientation=squarish" />
                      <AvatarFallback>EJ</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{featuredPost.author}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(featuredPost.date)} · {featuredPost.readTime} min read
                      </p>
                    </div>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700 !rounded-button whitespace-nowrap">
                    Read Article <i className="fas fa-arrow-right ml-2"></i>
                  </Button>
                </>
              )}
            </div>
            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
              {featuredPost && (
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              )}
            </div>
          </div>
        </section>
        
        {/* Author Bio & Newsletter */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>About the Author</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20female%20writer%20with%20thoughtful%20expression%2C%20neutral%20background%2C%20soft%20lighting%2C%20high%20quality%20portrait%20photography&width=300&height=300&seq=11&orientation=squarish" />
                <AvatarFallback>EJ</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold mb-2">Emma Johnson</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Award-winning writer, mindfulness advocate, and digital creator. I explore the intersections of creativity, psychology, and sustainable living. My work has been featured in The New Yorker, National Geographic, and The Atlantic.
                </p>
                <div className="flex space-x-3">
                  <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap">
                    <i className="fab fa-twitter mr-2 text-blue-400"></i> Twitter
                  </Button>
                  <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap">
                    <i className="fab fa-instagram mr-2 text-pink-500"></i> Instagram
                  </Button>
                  <Button variant="outline" size="sm" className="!rounded-button whitespace-nowrap">
                    <i className="fab fa-linkedin mr-2 text-blue-600"></i> LinkedIn
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Subscribe to Newsletter</CardTitle>
              <CardDescription>Get the latest posts and updates delivered to your inbox.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <Input type="text" placeholder="Your name" className="border-gray-300 dark:border-gray-700" />
                <Input type="email" placeholder="Your email" className="border-gray-300 dark:border-gray-700" />
                <Button className="w-full bg-purple-600 hover:bg-purple-700 !rounded-button whitespace-nowrap">
                  Subscribe <i className="fas fa-paper-plane ml-2"></i>
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>
        
        {/* Latest Posts */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Latest Posts</h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="!rounded-button whitespace-nowrap">
                <i className="fas fa-th-large mr-2"></i> Grid
              </Button>
              <Button variant="ghost" size="sm" className="!rounded-button whitespace-nowrap">
                <i className="fas fa-list mr-2"></i> List
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.filter(post => !post.featured).slice(0, 6).map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105"
                  />
                  <Badge className="absolute top-3 left-3 bg-purple-600 hover:bg-purple-700 cursor-pointer">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                    <span>{formatDate(post.date)}</span>
                    <span><i className="far fa-clock mr-1"></i> {post.readTime} min read</span>
                  </div>
                  <CardTitle className="text-xl hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                    {post.excerpt}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-4">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20female%20writer%20with%20thoughtful%20expression%2C%20neutral%20background%2C%20soft%20lighting%2C%20high%20quality%20portrait%20photography&width=100&height=100&seq=12&orientation=squarish" />
                      <AvatarFallback>EJ</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{post.author}</span>
                  </div>
                  <div className="flex space-x-3 text-gray-600 dark:text-gray-400">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400">
                            <i className="far fa-heart"></i> <span className="text-sm">{post.likes}</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Like this post</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400">
                            <i className="far fa-comment"></i> <span className="text-sm">{post.comments}</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Comments</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="cursor-pointer hover:text-purple-600 dark:hover:text-purple-400">
                            <i className="far fa-bookmark"></i>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Save for later</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-10">
            <Button variant="outline" className="!rounded-button whitespace-nowrap">
              Load More <i className="fas fa-chevron-down ml-2"></i>
            </Button>
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Explore Categories</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                    <i className={`fas ${category.icon} text-2xl text-purple-600 dark:text-purple-400`}></i>
                  </div>
                  <CardTitle className="text-lg mb-1">{category.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{category.count} articles</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Featured Article with Table of Contents */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <Badge className="mb-2 self-start bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                Featured Article
              </Badge>
              <CardTitle className="text-2xl md:text-3xl">The Art of Mindful Writing: Finding Your Voice in a Noisy World</CardTitle>
              <div className="flex items-center mt-4">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20female%20writer%20with%20thoughtful%20expression%2C%20neutral%20background%2C%20soft%20lighting%2C%20high%20quality%20portrait%20photography&width=100&height=100&seq=13&orientation=squarish" />
                  <AvatarFallback>EJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Emma Johnson</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    May 28, 2025 · 8 min read
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 prose dark:prose-invert max-w-none">
                <img 
                  src="https://readdy.ai/api/search-image?query=a%20professional%20writer%20working%20in%20a%20peaceful%20minimalist%20office%20with%20natural%20light%2C%20plants%2C%20and%20a%20laptop%2C%20soft%20morning%20light%20streaming%20through%20windows%2C%20calm%20atmosphere%2C%20high%20quality%20professional%20photography&width=800&height=500&seq=14&orientation=landscape" 
                  alt="Mindful Writing"
                  className="w-full h-auto rounded-lg mb-6"
                />
                
                <p>In today's fast-paced digital world, where content is constantly competing for attention, finding your authentic voice as a writer can feel like an impossible task. The pressure to create viral content, gain followers, and establish authority can lead many writers to adopt voices that aren't truly their own.</p>
                
                <p>Yet the most impactful writing—the kind that resonates deeply with readers and stands the test of time—comes from a place of authenticity and mindful awareness. This article explores how mindfulness practices can enhance your writing process and help you develop a unique voice that cuts through the noise.</p>
                
                <h2>The Mindfulness-Creativity Connection</h2>
                
                <p>Mindfulness—the practice of bringing non-judgmental awareness to the present moment—creates the optimal conditions for creativity to flourish. When we write from a mindful state, we're able to:</p>
                
                <ul>
                  <li><strong>Observe our thoughts without attachment</strong>, allowing us to recognize and move past creative blocks</li>
                  <li><strong>Connect more deeply with our authentic experiences</strong>, drawing from a well of genuine material</li>
                  <li><strong>Notice subtle details</strong> that might otherwise escape our attention</li>
                  <li><strong>Remain open to unexpected insights</strong> that can take our writing in fresh directions</li>
                </ul>
                
                <p>Research in cognitive psychology supports this connection. A 2012 study published in the Journal of Cognitive Psychology found that mindfulness meditation improved participants' divergent thinking—a key component of creativity that involves generating multiple ideas and solutions.</p>
                
                <h2>Practical Mindfulness Techniques for Writers</h2>
                
                <p>Incorporating mindfulness into your writing practice doesn't require hours of meditation (though that certainly wouldn't hurt). Here are some practical techniques you can begin using immediately:</p>
                
                <h3>1. The Five-Minute Centering Practice</h3>
                
                <p>Before you begin writing, take five minutes to center yourself:</p>
                
                <ul>
                  <li>Sit comfortably and close your eyes</li>
                  <li>Take three deep breaths, feeling the sensation of the breath in your body</li>
                  <li>Notice any physical sensations, emotions, or thoughts without trying to change them</li>
                  <li>Set an intention for your writing session (e.g., "I intend to write with curiosity and openness")</li>
                  <li>Gently open your eyes and begin writing</li>
                </ul>
                
                <div className="bg-purple-50 dark:bg-gray-800 p-6 rounded-lg my-6">
                  <h3 className="text-purple-700 dark:text-purple-300 mb-2">Try This: Sensory Awareness Exercise</h3>
                  <p className="mb-4">Take a moment to notice:</p>
                  <ul className="space-y-2">
                    <li><strong>5 things you can see</strong> around you right now</li>
                    <li><strong>4 things you can feel</strong> (physical sensations)</li>
                    <li><strong>3 things you can hear</strong></li>
                    <li><strong>2 things you can smell</strong></li>
                    <li><strong>1 thing you can taste</strong></li>
                  </ul>
                  <p className="mt-4">Use these observations as potential details in your writing.</p>
                </div>
                
                <h3>2. Mindful Freewriting</h3>
                
                <p>Freewriting—writing continuously without stopping to edit or censor yourself—becomes even more powerful when combined with mindfulness:</p>
                
                <ul>
                  <li>Set a timer for 10-15 minutes</li>
                  <li>Begin writing whatever comes to mind, without judgment</li>
                  <li>When you notice your inner critic appearing, acknowledge it without attachment ("I notice I'm judging my writing") and continue</li>
                  <li>If you get stuck, describe the stuckness ("I'm feeling stuck right now and noticing tension in my shoulders")</li>
                  <li>When the timer ends, review what you've written with curiosity rather than criticism</li>
                </ul>
                
                <p>This practice helps bypass the analytical mind that often blocks authentic expression, allowing your unique voice to emerge naturally.</p>
                
                <div className="not-prose my-8">
                  <blockquote className="border-l-4 border-purple-500 pl-4 py-2 italic text-gray-700 dark:text-gray-300">
                    "The best writing comes from a place of presence—when we're fully engaged with our words, our subject, and the subtle movements of our own minds."
                  </blockquote>
                </div>
                
                <h2>Finding Your Authentic Voice</h2>
                
                <p>Your authentic voice as a writer isn't something you create—it's something you uncover by removing the layers of imitation, expectation, and self-censorship that have accumulated over time.</p>
                
                <p>Mindfulness helps with this excavation process by teaching us to recognize when we're writing to impress, writing what we think others want to hear, or writing in someone else's voice. With practice, we become more skilled at noticing these tendencies and gently redirecting ourselves toward authenticity.</p>
                
                <h3>Questions for Uncovering Your Authentic Voice:</h3>
                
                <ul>
                  <li>What topics make me lose track of time when I'm writing about them?</li>
                  <li>What pieces of writing have felt most effortless or energizing?</li>
                  <li>If I could write without fear of judgment, what would I say?</li>
                  <li>What life experiences have shaped my unique perspective?</li>
                  <li>What writers do I admire, and what qualities in their work resonate with me?</li>
                </ul>
                
                <p>Reflecting on these questions can help you identify the elements that make your voice uniquely yours.</p>
                
                <h2>Conclusion: The Mindful Writer's Journey</h2>
                
                <p>Developing your authentic voice through mindful writing isn't a destination but a continuous journey. There will be days when the words flow effortlessly and days when each sentence feels like a struggle. The practice of mindfulness teaches us to approach both experiences with the same curious, non-judgmental awareness.</p>
                
                <p>As you continue on this path, you'll likely find that your writing becomes not only more authentic but also more impactful. Readers are drawn to writing that comes from a place of genuine presence and truth—the very qualities that mindful writing cultivates.</p>
                
                <p>Remember that your voice matters precisely because it is yours, with all its quirks, insights, and unique perspectives. In a world full of noise, mindful authenticity is what truly cuts through.</p>
                
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex space-x-4">
                    <Button variant="outline" className="!rounded-button whitespace-nowrap">
                      <i className="far fa-heart mr-2"></i> Like
                    </Button>
                    <Button variant="outline" className="!rounded-button whitespace-nowrap">
                      <i className="far fa-bookmark mr-2"></i> Save
                    </Button>
                    <Button variant="outline" className="!rounded-button whitespace-nowrap">
                      <i className="fas fa-share-alt mr-2"></i> Share
                    </Button>
                  </div>
                  <Button variant="outline" className="!rounded-button whitespace-nowrap">
                    <i className="fas fa-print mr-2"></i> Print
                  </Button>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Table of Contents</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[300px]">
                        <div className="p-4">
                          <ul className="space-y-3">
                            <li>
                              <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">Introduction</a>
                            </li>
                            <li>
                              <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400">The Mindfulness-Creativity Connection</a>
                            </li>
                            <li>
                              <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400">Practical Mindfulness Techniques for Writers</a>
                              <ul className="ml-4 mt-2 space-y-2">
                                <li>
                                  <a href="#" className="text-sm hover:text-purple-600 dark:hover:text-purple-400">The Five-Minute Centering Practice</a>
                                </li>
                                <li>
                                  <a href="#" className="text-sm hover:text-purple-600 dark:hover:text-purple-400">Mindful Freewriting</a>
                                </li>
                              </ul>
                            </li>
                            <li>
                              <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400">Finding Your Authentic Voice</a>
                            </li>
                            <li>
                              <a href="#" className="hover:text-purple-600 dark:hover:text-purple-400">Conclusion: The Mindful Writer's Journey</a>
                            </li>
                          </ul>
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Reading Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Progress value={scrollProgress} className="h-2 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">{Math.round(scrollProgress)}% complete</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Estimated reading time: 8 minutes</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Related Articles</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {blogPosts.slice(1, 4).map((post) => (
                          <div key={post.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                            <h3 className="font-medium hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {formatDate(post.date)} · {post.readTime} min read
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Comments Section */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Comments (32)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20male%20with%20friendly%20expression%2C%20neutral%20background%2C%20soft%20lighting%2C%20high%20quality%20portrait%20photography&width=100&height=100&seq=15&orientation=squarish" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Input 
                      placeholder="Add a comment..." 
                      className="mb-2 border-gray-300 dark:border-gray-700"
                    />
                    <div className="flex justify-end">
                      <Button className="bg-purple-600 hover:bg-purple-700 !rounded-button whitespace-nowrap">
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Comment 1 */}
                <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20middle%20aged%20woman%20with%20glasses%2C%20neutral%20background%2C%20soft%20lighting%2C%20high%20quality%20portrait%20photography&width=100&height=100&seq=16&orientation=squarish" />
                      <AvatarFallback>SL</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">Sarah Lee</h4>
                        <span className="text-sm text-gray-600 dark:text-gray-400">3 days ago</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        This article came at the perfect time for me. I've been struggling with finding my voice amid all the "content creation" advice out there. The mindful freewriting technique has already helped me break through some barriers in my writing. Thank you for sharing these insights!
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <button className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">
                          <i className="far fa-heart mr-1"></i> 12
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">
                          <i className="far fa-comment mr-1"></i> Reply
                        </button>
                      </div>
                      
                      {/* Nested reply */}
                      <div className="mt-4 ml-8 pt-4 border-t border-gray-100 dark:border-gray-900">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20female%20writer%20with%20thoughtful%20expression%2C%20neutral%20background%2C%20soft%20lighting%2C%20high%20quality%20portrait%20photography&width=100&height=100&seq=17&orientation=squarish" />
                            <AvatarFallback>EJ</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">Emma Johnson</h4>
                              <span className="text-sm text-gray-600 dark:text-gray-400">2 days ago</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-3">
                              I'm so glad to hear that, Sarah! The mindful freewriting technique was a game-changer for me as well. If you're interested, I'll be hosting a workshop on these techniques next month.
                            </p>
                            <div className="flex items-center space-x-4 text-sm">
                              <button className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">
                                <i className="far fa-heart mr-1"></i> 5
                              </button>
                              <button className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">
                                <i className="far fa-comment mr-1"></i> Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Comment 2 */}
                <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20an%20older%20male%20with%20beard%2C%20neutral%20background%2C%20soft%20lighting%2C%20high%20quality%20portrait%20photography&width=100&height=100&seq=18&orientation=squarish" />
                      <AvatarFallback>RM</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">Robert Martinez</h4>
                        <span className="text-sm text-gray-600 dark:text-gray-400">1 week ago</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        I appreciate the practical approach here. So many articles on finding your voice are vague and unhelpful, but these concrete exercises give me something to actually work with. I've been meditating for years but never thought to apply mindfulness directly to my writing practice.
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <button className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">
                          <i className="far fa-heart mr-1"></i> 8
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">
                          <i className="far fa-comment mr-1"></i> Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Comment 3 */}
                <div>
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20young%20female%20with%20curly%20hair%2C%20neutral%20background%2C%20soft%20lighting%2C%20high%20quality%20portrait%20photography&width=100&height=100&seq=19&orientation=squarish" />
                      <AvatarFallback>AP</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">Aisha Patel</h4>
                        <span className="text-sm text-gray-600 dark:text-gray-400">2 weeks ago</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        This resonated deeply with me. As someone who writes in both English and Hindi, I often struggle with which "voice" is truly mine. The questions for uncovering your authentic voice were particularly helpful—they made me realize that my most natural writing happens when I allow both languages to influence my expression.
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <button className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">
                          <i className="far fa-heart mr-1"></i> 15
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer">
                          <i className="far fa-comment mr-1"></i> Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <Button variant="outline" className="!rounded-button whitespace-nowrap">
                  Load More Comments <i className="fas fa-chevron-down ml-2"></i>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Analytics Dashboard */}
        <section className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle>Blog Analytics</CardTitle>
              <CardDescription>Track your blog's performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="views">
                <TabsList className="mb-6">
                  <TabsTrigger value="views">Page Views</TabsTrigger>
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                  <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
                </TabsList>
                
                <TabsContent value="views">
                  <div id="analytics-chart" className="h-80 w-full"></div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
                            <h3 className="text-2xl font-bold">24,892</h3>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <i className="fas fa-eye text-green-600 dark:text-green-400"></i>
                          </div>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                          <i className="fas fa-arrow-up mr-1"></i> 12% from last month
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Time on Page</p>
                            <h3 className="text-2xl font-bold">4:32</h3>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <i className="fas fa-clock text-blue-600 dark:text-blue-400"></i>
                          </div>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                          <i className="fas fa-arrow-up mr-1"></i> 8% from last month
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Bounce Rate</p>
                            <h3 className="text-2xl font-bold">32%</h3>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                            <i className="fas fa-undo text-amber-600 dark:text-amber-400"></i>
                          </div>
                        </div>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                          <i className="fas fa-arrow-up mr-1"></i> 3% from last month
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="engagement">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Most Popular Posts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {popularPosts.map((post) => (
                            <div key={post.id} className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                <img 
                                  src={post.image} 
                                  alt={post.title}
                                  className="w-full h-full object-cover object-top"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium line-clamp-1">{post.title}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {formatDate(post.date)} · {post.views.toLocaleString()} views
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Engagement by Platform</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                                <i className="fab fa-twitter text-blue-600 dark:text-blue-400"></i>
                              </div>
                              <span>Twitter</span>
                            </div>
                            <span className="font-medium">42%</span>
                          </div>
                          <Progress value={42} className="h-2" />
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center mr-3">
                                <i className="fab fa-instagram text-pink-600 dark:text-pink-400"></i>
                              </div>
                              <span>Instagram</span>
                            </div>
                            <span className="font-medium">28%</span>
                          </div>
                          <Progress value={28} className="h-2" />
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                                <i className="fab fa-linkedin text-blue-600 dark:text-blue-400"></i>
                              </div>
                              <span>LinkedIn</span>
                            </div>
                            <span className="font-medium">18%</span>
                          </div>
                          <Progress value={18} className="h-2" />
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-3">
                                <i className="fab fa-pinterest text-red-600 dark:text-red-400"></i>
                              </div>
                              <span>Pinterest</span>
                            </div>
                            <span className="font-medium">12%</span>
                          </div>
                          <Progress value={12} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="subscribers">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Subscribers</p>
                            <h3 className="text-2xl font-bold">3,842</h3>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                            <i className="fas fa-users text-purple-600 dark:text-purple-400"></i>
                          </div>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                          <i className="fas fa-arrow-up mr-1"></i> 15% from last month
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Open Rate</p>
                            <h3 className="text-2xl font-bold">42%</h3>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                            <i className="fas fa-envelope-open text-green-600 dark:text-green-400"></i>
                          </div>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                          <i className="fas fa-arrow-up mr-1"></i> 3% from last month
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Click Rate</p>
                            <h3 className="text-2xl font-bold">18%</h3>
                          </div>
                          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                            <i className="fas fa-mouse-pointer text-blue-600 dark:text-blue-400"></i>
                          </div>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                          <i className="fas fa-arrow-up mr-1"></i> 2% from last month
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Subscribers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="divide-y divide-gray-200 dark:divide-gray-800">
                        {[
                          { name: "Michael Chen", email: "michael.c@example.com", date: "2025-05-30" },
                          { name: "Jessica Williams", email: "j.williams@example.com", date: "2025-05-29" },
                          { name: "David Kim", email: "david.kim@example.com", date: "2025-05-28" },
                          { name: "Sophia Rodriguez", email: "sophia.r@example.com", date: "2025-05-27" },
                          { name: "James Johnson", email: "james.j@example.com", date: "2025-05-26" }
                        ].map((subscriber, index) => (
                          <div key={index} className="py-3 flex items-center justify-between">
                            <div>
                              <p className="font-medium">{subscriber.name}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{subscriber.email}</p>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(subscriber.date)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </section>
      </main>
      
      <footer className="bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4">Emma Johnson</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Exploring mindfulness, creativity, and sustainable living through thoughtful writing and practical insights.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400" aria-label="Twitter">
                  <i className="fab fa-twitter text-lg"></i>
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400" aria-label="Instagram">
                  <i className="fab fa-instagram text-lg"></i>
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400" aria-label="LinkedIn">
                  <i className="fab fa-linkedin text-lg"></i>
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400" aria-label="Pinterest">
                  <i className="fab fa-pinterest text-lg"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Home</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">About</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Portfolio</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Contact</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.slice(0, 6).map((category) => (
                  <li key={category.name}>
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-4">Newsletter</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Subscribe to get the latest posts and updates delivered to your inbox.
              </p>
              <form className="space-y-2">
                <Input type="email" placeholder="Your email" className="border-gray-300 dark:border-gray-700" />
                <Button className="w-full bg-purple-600 hover:bg-purple-700 !rounded-button whitespace-nowrap">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4 md:mb-0">
                © 2025 Emma Johnson. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <div className="flex items-center">
                  <i className="fab fa-cc-visa text-xl mr-2 text-blue-600"></i>
                  <i className="fab fa-cc-mastercard text-xl mr-2 text-red-600"></i>
                  <i className="fab fa-cc-paypal text-xl text-blue-800"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg cursor-pointer"
          aria-label="Back to top"
        >
          <i className="fas fa-arrow-up"></i>
        </button>
      </footer>
    </div>
  );
};

export default App;
