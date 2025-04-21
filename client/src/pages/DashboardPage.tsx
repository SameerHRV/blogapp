import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BlogLayout from "@/components/BlogLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useBlog } from "@/contexts/BlogContext";
import SubscriptionLimitAlert from "@/components/SubscriptionLimitAlert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import {
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Edit,
  Eye,
  FileText,
  MessageSquare,
  Plus,
  Trash2,
  TrendingUp,
  Users,
  BarChart2,
  PieChart,
  Calendar,
} from "lucide-react";

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { posts, comments, getPostsByTag, subscriptionInfo, getSubscriptionInfo } = useBlog();
  const navigate = useNavigate();

  // Redirect if not authenticated and fetch subscription info
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      getSubscriptionInfo();
    }
  }, [isAuthenticated, navigate, getSubscriptionInfo]);

  // Get user's posts (in a real app, this would filter by user ID)
  const userPosts = posts.slice(0, 5);

  // Get user's comments (in a real app, this would filter by user ID)
  const userComments = comments.slice(0, 5);

  // Sample data for charts
  const viewsData = [
    { name: "Mon", views: 120 },
    { name: "Tue", views: 150 },
    { name: "Wed", views: 180 },
    { name: "Thu", views: 145 },
    { name: "Fri", views: 190 },
    { name: "Sat", views: 210 },
    { name: "Sun", views: 250 },
  ];

  const engagementData = [
    { name: "Mon", comments: 12, likes: 25 },
    { name: "Tue", comments: 15, likes: 30 },
    { name: "Wed", comments: 18, likes: 35 },
    { name: "Thu", comments: 14, likes: 28 },
    { name: "Fri", comments: 19, likes: 38 },
    { name: "Sat", comments: 21, likes: 42 },
    { name: "Sun", comments: 25, likes: 50 },
  ];

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <BlogLayout>
      <div className="blog-container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
          </div>
          <Button
            onClick={() => navigate("/new")}
            className="flex items-center gap-2"
            disabled={subscriptionInfo?.hasReachedLimit}
          >
            <Plus size={16} />
            <span>New Post</span>
          </Button>
        </div>

        {/* Subscription Alert */}
        {subscriptionInfo && (
          <SubscriptionLimitAlert
            plan={subscriptionInfo.plan}
            remainingPosts={subscriptionInfo.remainingPosts}
            maxPosts={5} // Free plan limit
            hasReachedLimit={subscriptionInfo.hasReachedLimit}
          />
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Posts</p>
                  <h3 className="text-3xl font-bold">{userPosts.length}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Views</p>
                  <h3 className="text-3xl font-bold">1,245</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Comments</p>
                  <h3 className="text-3xl font-bold">{userComments.length}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Followers</p>
                  <h3 className="text-3xl font-bold">42</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart2 size={16} />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText size={16} />
              <span>Posts</span>
            </TabsTrigger>
            <TabsTrigger value="comments" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>Comments</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Calendar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Views Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp size={18} />
                    <span>Views Over Time</span>
                  </CardTitle>
                  <CardDescription>Daily view count for the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={viewsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Engagement Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart size={18} />
                    <span>Engagement Metrics</span>
                  </CardTitle>
                  <CardDescription>Comments and likes for the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={engagementData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="comments" fill="hsl(var(--primary))" />
                        <Bar dataKey="likes" fill="hsl(var(--accent))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle>Recent Posts</CardTitle>
                <CardDescription>Manage your blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                {userPosts.length > 0 ? (
                  <div className="space-y-4">
                    {userPosts.map((post) => (
                      <div key={post._id} className="flex items-center justify-between p-4 border rounded-md">
                        <div className="flex items-center gap-4">
                          {post.coverImage ? (
                            <img src={post.coverImage} alt={post.title} className="w-16 h-16 object-cover rounded-md" />
                          ) : (
                            <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                              <FileText className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium">{post.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{formatDistanceToNow(new Date(post.createdAt))} ago</span>
                              <span>•</span>
                              <span>{post.views} views</span>
                            </div>
                            <div className="flex gap-2 mt-1">
                              {post.tags &&
                                post.tags.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={typeof tag === "object" ? tag._id : tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {typeof tag === "object" ? tag.name : tag}
                                  </Badge>
                                ))}
                              {post.tags && post.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{post.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/post/${post._id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => navigate(`/edit/${post._id}`)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">Start creating content to grow your blog.</p>
                    <Button onClick={() => navigate("/new")}>Create Your First Post</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments">
            <Card>
              <CardHeader>
                <CardTitle>Recent Comments</CardTitle>
                <CardDescription>Manage comments on your posts</CardDescription>
              </CardHeader>
              <CardContent>
                {userComments.length > 0 ? (
                  <div className="space-y-4">
                    {userComments.map((comment) => (
                      <div key={comment.id} className="p-4 border rounded-md">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{comment.author}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.createdAt))} ago
                            </p>
                          </div>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                        <div className="flex justify-between items-center mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => navigate(`/post/${comment.postId}`)}
                          >
                            View Post
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No comments yet</h3>
                    <p className="text-muted-foreground">Comments on your posts will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Content Calendar</CardTitle>
                <CardDescription>Plan and schedule your upcoming content</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Calendar Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    We're working on a content calendar feature to help you plan and schedule your posts.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BlogLayout>
  );
};

export default DashboardPage;
