import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message, Space, Typography, Card, Divider } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import { 
  UploadOutlined, 
  FileImageOutlined, 
  VideoCameraOutlined,
  EditOutlined
} from "@ant-design/icons";
import PostService from "../../Services/PostService";

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
const uploader = new UploadFileService();

// Decorative musical note style - matching first component
const musicalNoteStyle = {
  position: 'absolute',
  fontSize: '32px',
  color: 'rgba(106, 17, 203, 0.2)',
  zIndex: 0
};

const CreatePostModal = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [fileType, setFileType] = useState("image");
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      
      const body = {
        ...values,
        mediaLink: image,
        userId: snap.currentUser?.uid,
        mediaType: fileType,
      };
      await PostService.createPost(body);
      state.posts = await PostService.getPosts();
      message.success("Post created successfully");
      state.createPostModalOpened = false;
      form.resetFields();
      setImage("");
    } catch (error) {
      console.error("Form validation failed:", error);
      message.error("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = async (info) => {
    if (info.file) {
      try {
        setImageUploading(true);
        const fileType = info.file.type.split("/")[0];
        setFileType(fileType);
        const url = await uploader.uploadFile(
          info.fileList[0].originFileObj,
          "posts"
        );
        setImage(url);
        form.setFieldsValue({ mediaLink: url });
        message.success(`${fileType} uploaded successfully`);
      } catch (error) {
        message.error("Upload failed. Please try again.");
        console.error("Upload error:", error);
      } finally {
        setImageUploading(false);
      }
    } else if (info.file.status === "removed") {
      setImage("");
      form.setFieldsValue({ mediaLink: "" });
    }
  };
  
  const handleCancel = () => {
    form.resetFields();
    setImage("");
    state.createPostModalOpened = false;
  };

  const MediaPreview = () => {
    if (!image) return null;
    
    if (fileType === "image") {
      return (
        <div style={{ 
          marginBottom: 16, 
          textAlign: "center",
          borderRadius: '10px', 
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(106,17,203,0.08)',
          position: 'relative'
        }}>
          <img
            src={image}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "300px"
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '30px 16px 16px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
          }}>
            <Upload
              accept="image/*,video/*"
              onChange={handleFileChange}
              showUploadList={false}
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button 
                icon={<UploadOutlined />} 
                type="primary"
                ghost
                style={{ 
                  borderColor: 'white', 
                  color: 'white',
                  borderRadius: '6px'
                }}
              >
                Change Media
              </Button>
            </Upload>
          </div>
        </div>
      );
    }
    
    if (fileType === "video") {
      return (
        <div style={{ 
          marginBottom: 16, 
          textAlign: "center",
          borderRadius: '10px', 
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(106,17,203,0.08)',
          position: 'relative'
        }}>
          <video
            controls
            src={image}
            style={{
              maxWidth: "100%",
              maxHeight: "300px"
            }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '30px 16px 16px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
          }}>
            <Upload
              accept="image/*,video/*"
              onChange={handleFileChange}
              showUploadList={false}
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button 
                icon={<UploadOutlined />} 
                type="primary"
                ghost
                style={{ 
                  borderColor: 'white', 
                  color: 'white',
                  borderRadius: '6px'
                }}
              >
                Change Media
              </Button>
            </Upload>
          </div>
        </div>
      );
    }
    
    return null;
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
            Create New Post
          </Title>
          {/* Musical note in title */}
          <span style={{ marginLeft: 8, fontSize: 20 }}>♪</span>
        </div>
      }
      open={state.createPostModalOpened}
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
          <Form.Item
            name="contentDescription"
            label={
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <EditOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                <span>Share Your Musical Journey</span>
              </span>
            }
            rules={[
              { required: true, message: "Please enter content description" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Share your latest practice session, new music discoveries, or thoughts..."
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          
          <Divider style={{ margin: '8px 0', background: themeColors.border }} />
          
          <MediaPreview />
          
          {!image && (
            <Form.Item
              name="mediaLink"
              label={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ marginRight: '8px', color: themeColors.primary, fontSize: '16px' }}>♪</span>
                  <span>Media</span>
                </span>
              }
              rules={[{ required: true, message: "Please upload an image or video" }]}
            >
              <div style={{
                border: `1px dashed ${themeColors.border}`,
                borderRadius: '10px',
                padding: '40px 0',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: themeColors.lightAccent,
                position: 'relative'
              }}>
                {/* Background musical notes */}
                <span style={{ ...musicalNoteStyle, top: 15, right: 40, color: 'rgba(106, 17, 203, 0.1)' }}>♪</span>
                <span style={{ ...musicalNoteStyle, bottom: 20, left: 70, color: 'rgba(106, 17, 203, 0.1)' }}>♫</span>
                
                {imageUploading ? (
                  <Text>Uploading media...</Text>
                ) : (
                  <Upload
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    showUploadList={false}
                    beforeUpload={() => false}
                    maxCount={1}
                  >
                    <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                        <FileImageOutlined style={{ fontSize: '24px', color: themeColors.primary, marginRight: '8px' }} />
                        <VideoCameraOutlined style={{ fontSize: '24px', color: themeColors.secondary }} />
                      </div>
                      <div>
                        <Text strong>Upload Photo or Video</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '12px' }}>Share your musical moments</Text>
                      </div>
                    </div>
                  </Upload>
                )}
              </div>
            </Form.Item>
          )}
          
          {imageUploading && (
            <div style={{ textAlign: "center", margin: "16px 0" }}>
              <Text type="secondary">Media is uploading, please wait...</Text>
            </div>
          )}
          
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
                disabled={imageUploading || !image}
                style={{
                  background: themeColors.gradient,
                  borderColor: themeColors.primary,
                  borderRadius: '6px',
                  boxShadow: "0 2px 8px rgba(106, 17, 203, 0.3)"
                }}
              >
                {loading ? "Creating..." : "Create Post"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export default CreatePostModal;