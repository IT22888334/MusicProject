import React, { useEffect } from "react";
import "../../Styles/center_section.css";
import StoryBox from "./StoryBox";
import MyPost from "./MyPostBox";
import FriendsPost from "./FriendsPost";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import PostService from "../../Services/PostService";
import LearningProgressBox from "./LearningProgressBox";
import LearningProgressCard from "./LearningProgressCard";
import CreaetSkillShareBox from "./SkillShareBox";
import SkillShareCard from "./SkillShareCard";
import FriendsSection from "./FriendsSection";
import NotificationsDropdown from "./NotificationsDropdown";
import { Tabs, Avatar, Row, Col } from "antd";

const { TabPane } = Tabs;

// Theme colors to match the MyPost component's theme
const themeColors = {
  primary: "#FFD100", // Vibrant yellow for main brand color
  secondary: "#FFBA08", // Warm amber yellow for secondary elements
  accent: "#FFC145", // Sunflower yellow for accents and highlights
  background: "#FFFAEB", // Soft cream-yellow for backgrounds
  surface: "#FFF8E1", // Light yellow for content surfaces
  cardBg: "#FFFFFF", // White background for cards
  textPrimary: "#2D2A32", // Deep charcoal for primary text
  textSecondary: "#645F68", // Muted gray for secondary text
  border: "rgba(0, 0, 0, 0.12)", // Subtle neutral border
  hover: "#FFB700", // Slightly darker yellow for hover effects
  gradient: "linear-gradient(135deg, #FFD100 0%, #FFBA08 100%)" // Dynamic yellow gradient
};

const CenterSection = () => {
  const snap = useSnapshot(state);
  
  useEffect(() => {
    PostService.getPosts()
      .then((result) => {
        state.posts = result;
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
      });
  }, []);
  
  // Custom Tab icons
  const tabIcons = {
    comments: "💬",
    learning: "🎵",
    skillshare: "🎹",
    friends: "👥"
  };

  return (
    <div className="center" style={{
      width: "100%",
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "0 16px"
    }}>
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        marginBottom: "20px"
      }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: 600,
          }}
        >
          <img style={{ maxHeight: 60 }} src="/assets/musicmentor-logo.svg" alt="logo" />
        </div>
        <Avatar
          style={{
            cursor: "pointer",
            border: `3px solid ${themeColors.primary}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
          }}
          onClick={() => {
            state.profileModalOpend = true;
          }}
          size={60}
          src={snap.currentUser?.image}
        />
      </nav>
      
      <StoryBox />
      
      <div style={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        marginBottom: "16px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Background music notes for visual appeal */}
        <div 
          style={{ 
            position: "absolute", 
            right: 20, 
            top: 15, 
            fontSize: "28px",
            color: `${themeColors.primary}`,
            opacity: 0.15,
            zIndex: 0
          }} 
        >
          ♪
        </div>
        <div 
          style={{ 
            position: "absolute", 
            right: 120, 
            bottom: 25, 
            fontSize: "38px",
            color: `${themeColors.secondary}`,
            opacity: 0.1,
            zIndex: 0
          }} 
        >
          ♫
        </div>
        <div 
          style={{ 
            position: "absolute", 
            left: 60, 
            bottom: 20, 
            fontSize: "45px",
            color: `${themeColors.accent}`,
            opacity: 0.1,
            zIndex: 0
          }} 
        >
          𝄢
        </div>
        
        <NotificationsDropdown />
        
        <Tabs
          defaultActiveKey="1"
          style={{ width: "100%", position: "relative", zIndex: 1 }}
          tabBarStyle={{ 
            marginBottom: "20px", 
            fontWeight: "600",
            borderBottom: `2px solid ${themeColors.surface}`
          }}
          tabBarGutter={24}
          animated={{ inkBar: true, tabPane: true }}
          // Customize the tabs style
          tabBarExtraContent={{
            right: (
              <div style={{ 
                fontSize: "20px", 
                padding: "0 12px",
                color: themeColors.textSecondary
              }}>
                🎵
              </div>
            )
          }}
        >
          <TabPane 
            tab={
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span 
                  style={{ 
                    backgroundColor: themeColors.lightAccent,
                    color: themeColors.textPrimary, 
                    width: "28px", 
                    height: "28px",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    borderRadius: "6px"
                  }}
                >
                  {tabIcons.comments}
                </span>
                <span>Comment & Feedback</span>
              </span>
            } 
            key="1"
          >
            <MyPost />
            <div>
              {snap.posts.map((post) => {
                return <FriendsPost key={post?.id} post={post} />;
              })}
            </div>
          </TabPane>
          
          <TabPane 
            tab={
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span 
                  style={{ 
                    backgroundColor: themeColors.lightAccent,
                    color: themeColors.textPrimary, 
                    width: "28px", 
                    height: "28px",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    borderRadius: "6px"
                  }}
                >
                  {tabIcons.learning}
                </span>
                <span>Learning Progress</span>
              </span>
            } 
            key="2"
          >
            <LearningProgressBox />
            <div>
              {snap.LearningProgresss.map((plan) => (
                <LearningProgressCard key={plan.id} plan={plan} />
              ))}
            </div>
          </TabPane>
          
          <TabPane 
            tab={
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span 
                  style={{ 
                    backgroundColor: themeColors.lightAccent,
                    color: themeColors.textPrimary, 
                    width: "28px", 
                    height: "28px",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    borderRadius: "6px"
                  }}
                >
                  {tabIcons.skillshare}
                </span>
                <span>SkillShare</span>
              </span>
            } 
            key="3"
          >
            <CreaetSkillShareBox />
            <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
              {snap.SkillShares.map((plan) => (
                <SkillShareCard key={plan.id} plan={plan} />
              ))}
            </Row>
          </TabPane>
          
          <TabPane 
            tab={
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span 
                  style={{ 
                    backgroundColor: themeColors.lightAccent,
                    color: themeColors.textPrimary, 
                    width: "28px", 
                    height: "28px",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    borderRadius: "6px"
                  }}
                >
                  {tabIcons.friends}
                </span>
                <span>Friends</span>
              </span>
            } 
            key="4"
          >
            <FriendsSection />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default CenterSection;