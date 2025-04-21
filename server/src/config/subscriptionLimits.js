// Define subscription plan limits
export const subscriptionLimits = {
  Free: {
    maxPosts: 5,
    analytics: "basic",
    support: "standard",
    features: {
      mobileResponsive: true,
      seoBasics: true,
      customDomain: false,
      removeAds: false,
      advancedAnalytics: false,
      prioritySupport: false,
      teamCollaboration: false,
      multipleAuthors: false,
      apiAccess: false,
    }
  },
  Pro: {
    maxPosts: Infinity,
    analytics: "advanced",
    support: "priority",
    features: {
      mobileResponsive: true,
      seoBasics: true,
      customDomain: true,
      removeAds: true,
      advancedAnalytics: true,
      prioritySupport: true,
      teamCollaboration: false,
      multipleAuthors: false,
      apiAccess: false,
    }
  },
  Business: {
    maxPosts: Infinity,
    analytics: "premium",
    support: "dedicated",
    features: {
      mobileResponsive: true,
      seoBasics: true,
      customDomain: true,
      removeAds: true,
      advancedAnalytics: true,
      prioritySupport: true,
      teamCollaboration: true,
      multipleAuthors: true,
      apiAccess: true,
    }
  }
};

// Helper function to get limits for a specific plan
export const getPlanLimits = (planName) => {
  return subscriptionLimits[planName] || subscriptionLimits.Free;
};

// Helper function to check if user has reached post limit
export const hasReachedPostLimit = async (user, Post) => {
  if (!user || !user.subscription) return true;
  
  const planName = user.subscription.plan;
  const limits = getPlanLimits(planName);
  
  // If unlimited posts, return false (hasn't reached limit)
  if (limits.maxPosts === Infinity) return false;
  
  // Count user's posts
  const postCount = await Post.countDocuments({ author: user._id });
  
  // Return true if limit reached or exceeded
  return postCount >= limits.maxPosts;
};

// Helper function to get remaining posts allowed
export const getRemainingPosts = async (user, Post) => {
  if (!user || !user.subscription) return 0;
  
  const planName = user.subscription.plan;
  const limits = getPlanLimits(planName);
  
  // If unlimited posts, return Infinity
  if (limits.maxPosts === Infinity) return Infinity;
  
  // Count user's posts
  const postCount = await Post.countDocuments({ author: user._id });
  
  // Return remaining posts (minimum 0)
  return Math.max(0, limits.maxPosts - postCount);
};
