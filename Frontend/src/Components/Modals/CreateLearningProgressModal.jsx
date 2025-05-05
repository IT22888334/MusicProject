import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Space, Typography, Card, Divider, Row, Col } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import LearningProgressService from "../../Services/LearningProgressService";
import { 
  EditOutlined, 
  FileTextOutlined, 
  AimOutlined, 
  ToolOutlined 
} from "@ant-design/icons";

// Music-themed color palette - matching the first component
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
  danger: "#F86E51", // Warm-toned red for warnings
  success: "#4CAF50", // Balanced green for success messages
  gradient: "linear-gradient(135deg, #FFD100 0%, #FFBA08 100%)", // Dynamic yellow gradient
  lightAccent: "#FFF3CC", // Very light yellow for subtle highlights
  focus: "#F8C537", // Golden yellow for focus states
};

const { Title, Text } = Typography;

// Decorative musical note style
const musicalNoteStyle = {
  position: 'absolute',
  fontSize: '32px',
  color: 'rgba(106, 17, 203, 0.2)',
  zIndex: 0
};

const CreateLearningProgressModal = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Create Learning Progress data object
      const LearningProgressData = {
        userId: snap.currentUser?.uid,
        planName: values.planName,
        description: values.description,
        goal: values.goal,
        routines: values.routines,
      };

      await LearningProgressService.CreateLearningProgressModal(LearningProgressData);
      state.LearningProgresss = await LearningProgressService.getAllLearningProgresss();
      
      // Success message
      message.success("Learning Progress shared successfully!");

      // Reset form and close modal
      form.resetFields();
      state.CreateLearningProgressModalOpened = false;
    } catch (error) {
      console.error("Form validation failed:", error);
      
      // Error message
      message.error("Failed to share Learning Progress. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    state.CreateLearningProgressModalOpened = false;
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            width: 4,
            height: 24,
            background: themeColors.gradient,
            marginRight: 12,
            borderRadius: 2
          }} />
          <Title level={4} style={{ margin: 0, color: themeColors.textPrimary }}>
            Share Musical Progress
          </Title>
          {/* Musical note in title */}
          <span style={{ marginLeft: 8, fontSize: 20 }}>♪</span>
        </div>
      }
      open={snap.CreateLearningProgressModalOpened}
      onCancel={handleCancel}
      footer={null}
      width={600}
      bodyStyle={{ 
        padding: '20px', 
        backgroundColor: themeColors.background,
        borderRadius: '10px'
      }}
      centered
      destroyOnClose
    >
      {/* Decorative musical notes */}
      <div style={{ ...musicalNoteStyle, top: 15, right: 40 }}>♪</div>
      <div style={{ ...musicalNoteStyle, bottom: 20, right: 70 }}>♫</div>
      <div style={{ ...musicalNoteStyle, bottom: 80, left: 30 }}>𝄞</div>
      <div style={{ ...musicalNoteStyle, top: 70, left: 20 }}>♩</div>
      
      <Card 
        bordered={false} 
        style={{ 
          background: themeColors.cardBg,
          borderRadius: '10px',
          boxShadow: '0 6px 16px rgba(106, 17, 203, 0.08)',
          position: 'relative',
          zIndex: 1
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item
                name="planName"
                label={
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <EditOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                    Progress Title
                  </span>
                }
                rules={[{ required: true, message: "Please add a title" }]}
              >
                <Input 
                  placeholder="Give a brief title for your musical progress" 
                  style={{ borderRadius: 8 }}
                />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <FileTextOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                Progress Description
              </span>
            }
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <Input.TextArea 
              placeholder="Describe your recent musical learning achievements and challenges" 
              rows={4}
              style={{ 
                borderRadius: 8,
                backgroundColor: themeColors.lightAccent,
                border: `1px solid ${themeColors.border}` 
              }}
            />
          </Form.Item>
          
          <div style={{ 
            backgroundColor: themeColors.surface,
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '16px',
            position: 'relative',
            border: `1px solid ${themeColors.border}`
          }}>
            {/* Small decorative quarter note */}
            <span style={{ 
              position: 'absolute', 
              right: 10, 
              bottom: 10, 
              fontSize: '18px', 
              color: 'rgba(106, 17, 203, 0.15)' 
            }}>♩</span>
            
            <Form.Item
              name="goal"
              label={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <AimOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                  Tutorials & Materials Used
                </span>
              }
              rules={[{ required: true, message: "Please enter tutorials" }]}
            >
              <Input 
                placeholder="Books, videos, or courses you've been learning from" 
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
            
            <Form.Item
              name="routines"
              label={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <ToolOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                  New Skills Acquired
                </span>
              }
              rules={[{ required: true, message: "Please enter Skills" }]}
              style={{ marginBottom: 0 }}
            >
              <Input.TextArea 
                placeholder="Techniques, theory, or musical skills you've mastered recently" 
                rows={3}
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          </div>
          
          <Divider style={{ margin: '8px 0', background: themeColors.border }} />
          
          <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                onClick={handleCancel}
                style={{
                  borderRadius: '6px',
                }}
              >
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                style={{
                  background: themeColors.gradient,
                  borderColor: themeColors.primary,
                  borderRadius: '6px',
                  boxShadow: "0 2px 8px rgba(106, 17, 203, 0.3)"
                }}
              >
                {loading ? "Sharing..." : "Share Progress"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export default CreateLearningProgressModal;