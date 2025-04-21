import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  Menu,
  X,
  LayoutGrid,
  LogIn,
  UserPlus,
  User,
  LogOut,
  Search,
  Info,
  Sparkles,
  Mail,
  BarChart2,
  ChevronDown,
  FileText,
  Hash,
  Settings,
  HelpCircle,
  Plus,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const NavBar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    if (path === "/blog") {
      return (
        location.pathname === "/blog" ||
        location.pathname.startsWith("/post/") ||
        location.pathname.startsWith("/tags") ||
        location.pathname.startsWith("/search") ||
        location.pathname.startsWith("/new") ||
        location.pathname.startsWith("/edit/")
      );
    }
    return location.pathname.startsWith(path);
  };

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (isAuthenticated) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchOpen(false);
      } else {
        toast.error("Please log in to search");
        navigate("/login", { state: { from: "/search" } });
        setSearchOpen(false);
      }
    }
  };

  return (
    <nav
      className={`sticky top-0 bg-background/95 backdrop-blur-md z-10 transition-all duration-300 ${
        isScrolled ? "border-b shadow-sm" : ""
      }`}
    >
      <div className="blog-container py-3 flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2 relative">
            <span className="font-display font-bold text-2xl">
              <span className="text-primary">Blogger</span> App
            </span>
            {isScrolled && (
              <div className="absolute h-1 w-6 bg-primary rounded-full -bottom-1 left-1 animate-pulse-soft"></div>
            )}
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex items-center justify-center space-x-1 flex-grow">
          <Link to="/">
            <Button
              variant={isActive("/") && !isActive("/blog") ? "secondary" : "ghost"}
              size="sm"
              className={`flex items-center gap-2 ${isActive("/") && !isActive("/blog") ? "font-medium" : ""}`}
            >
              <Home size={16} />
              <span>Home</span>
            </Button>
          </Link>

          {/* Blog Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={isActive("/blog") ? "secondary" : "ghost"}
                size="sm"
                className={`flex items-center gap-2 ${isActive("/blog") ? "font-medium" : ""}`}
              >
                <LayoutGrid size={16} />
                <span>Blog</span>
                <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem
                onClick={() => {
                  if (isAuthenticated) {
                    navigate("/blog");
                  } else {
                    toast.error("Please log in to access the blog");
                    navigate("/login", { state: { from: "/blog" } });
                  }
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                <span>All Posts</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (isAuthenticated) {
                    navigate("/tags");
                  } else {
                    toast.error("Please log in to access tags");
                    navigate("/login", { state: { from: "/tags" } });
                  }
                }}
              >
                <Hash className="mr-2 h-4 w-4" />
                <span>Tags</span>
              </DropdownMenuItem>
              {isAuthenticated && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      if (isAuthenticated) {
                        navigate("/new");
                      } else {
                        toast.error("Please log in to create a new post");
                        navigate("/login", { state: { from: "/new" } });
                      }
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span>New Post</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/about">
            <Button variant={isActive("/about") ? "secondary" : "ghost"} size="sm" className="flex items-center gap-2">
              <Info size={16} />
              <span>About</span>
            </Button>
          </Link>

          <Link to="/features">
            <Button
              variant={isActive("/features") ? "secondary" : "ghost"}
              size="sm"
              className="flex items-center gap-2"
            >
              <Sparkles size={16} />
              <span>Features</span>
            </Button>
          </Link>

          <Link to="/contact">
            <Button
              variant={isActive("/contact") ? "secondary" : "ghost"}
              size="sm"
              className="flex items-center gap-2"
            >
              <Mail size={16} />
              <span>Contact</span>
            </Button>
          </Link>
        </div>

        {/* Right Side - Auth & Search */}
        <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
          {/* Search Dialog */}
          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Search size={18} />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <Button type="submit">Search</Button>
              </form>
            </DialogContent>
          </Dialog>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2 pr-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="hidden lg:inline max-w-[100px] truncate">{user?.name}</span>
                  <ChevronDown size={14} className="hidden lg:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <BarChart2 className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/new")}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>New Post</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open("/contact", "_blank")}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <LogIn size={16} />
                  <span>Login</span>
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="flex items-center gap-2">
                  <UserPlus size={16} />
                  <span>Register</span>
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t animate-fade-in">
          <div className="p-4 space-y-2">
            {/* Search in mobile menu */}
            <form onSubmit={handleSearch} className="flex gap-2 mb-3">
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Search size={18} />
              </Button>
            </form>

            <Link to="/" className="block">
              <Button
                variant={isActive("/") && !isActive("/blog") ? "secondary" : "ghost"}
                className={`w-full justify-start text-left ${isActive("/") && !isActive("/blog") ? "font-medium" : ""}`}
              >
                <Home size={18} className="mr-2" />
                <span>Home</span>
              </Button>
            </Link>

            <Button
              variant={isActive("/blog") ? "secondary" : "ghost"}
              className={`w-full justify-start text-left ${isActive("/blog") ? "font-medium" : ""}`}
              onClick={() => {
                if (isAuthenticated) {
                  navigate("/blog");
                } else {
                  toast.error("Please log in to access the blog");
                  navigate("/login", { state: { from: "/blog" } });
                }
              }}
            >
              <LayoutGrid size={18} className="mr-2" />
              <span>Blog</span>
            </Button>

            <Button
              variant={isActive("/new") ? "secondary" : "ghost"}
              className="w-full justify-start text-left"
              onClick={() => {
                if (isAuthenticated) {
                  navigate("/new");
                } else {
                  toast.error("Please log in to create a new post");
                  navigate("/login", { state: { from: "/new" } });
                }
              }}
            >
              <Plus size={18} className="mr-2" />
              <span>New Post</span>
            </Button>

            <Link to="/about" className="block">
              <Button variant={isActive("/about") ? "secondary" : "ghost"} className="w-full justify-start text-left">
                <Info size={18} className="mr-2" />
                <span>About</span>
              </Button>
            </Link>

            <Link to="/features" className="block">
              <Button
                variant={isActive("/features") ? "secondary" : "ghost"}
                className="w-full justify-start text-left"
              >
                <Sparkles size={18} className="mr-2" />
                <span>Features</span>
              </Button>
            </Link>

            <Link to="/contact" className="block">
              <Button variant={isActive("/contact") ? "secondary" : "ghost"} className="w-full justify-start text-left">
                <Mail size={18} className="mr-2" />
                <span>Contact</span>
              </Button>
            </Link>

            <Separator className="my-2" />

            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 px-3 py-2 mb-2 bg-muted/30 rounded-md">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <Link to="/dashboard" className="block">
                  <Button variant="ghost" className="w-full justify-start text-left">
                    <BarChart2 size={18} className="mr-2" />
                    <span>Dashboard</span>
                  </Button>
                </Link>

                <Link to="/profile" className="block">
                  <Button variant="ghost" className="w-full justify-start text-left">
                    <User size={18} className="mr-2" />
                    <span>Profile</span>
                  </Button>
                </Link>

                <Link to="/profile" className="block">
                  <Button variant="ghost" className="w-full justify-start text-left">
                    <Settings size={18} className="mr-2" />
                    <span>Settings</span>
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={() => {
                    logout();
                    navigate("/");
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut size={18} className="mr-2" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link to="/login" className="block">
                  <Button variant="outline" className="w-full justify-center">
                    <LogIn size={18} className="mr-2" />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link to="/register" className="block">
                  <Button className="w-full justify-center">
                    <UserPlus size={18} className="mr-2" />
                    <span>Register</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
