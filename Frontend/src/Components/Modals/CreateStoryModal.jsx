import React, { useState } from "react";
import {
  Modal,
  Upload,
  Input,
  Button,
  DatePicker,
  message,
  Select,
  Form,
  Slider,
  Typography,
  Card,
  Divider,
  Row,
  Col
} from "antd";
import { 
  UploadOutlined, 
  ClockCircleOutlined, 
  FireOutlined,
  CalendarOutlined,
  EditOutlined,
  TagOutlined
} from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import StoryService from "../../Services/StoryService";
import moment from "moment";

// Music-themed color palette
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

const uploader = new UploadFileService();
const { Option } = Select;
const { Text, Title } = Typography;

const CreateStoryModal = () => {
  const snap = useSnapshot(state);
  const [imageUploading, setImageUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    timestamp: null,
    exerciseType: "",
    timeDuration: 30,
    intensity: "",
    image: ""
  });

  // Duration markers for slider - renamed to "Practice Duration"
  const durationMarks = {
    0: '0',
    15: '15',
    30: '30',
    45: '45',
    60: '60',
    90: '90',
    120: '120'
  };

  // Function to get intensity color based on duration
  const getIntensityColor = (duration) => {
    if (duration < 15) return '#6A11CB';     // Light - Beginner
    if (duration < 30) return '#8E44AD';     // Medium - Intermediate
    if (duration < 60) return '#B39DDB';     // High - Advanced
    return '#2575FC';                        // Very High - Professional
  };

  const handleCreateWorkoutStory = async () => {
    try {
      setLoading(true);
      const body = {
        ...formData,
        image: uploadedImage,
        userId: snap.currentUser?.uid,
      };
      
      await StoryService.createWorkoutStory(body);
      state.storyCards = await StoryService.getAllWorkoutStories();
      message.success("Music Learning Plan created successfully");
      
      // Reset form and modal
      form.resetFields();
      setUploadedImage(null);
      state.createWorkoutStatusModalOpened = false;
    } catch (error) {
      message.error("Error creating Music Learning Plan");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      try {
        const url = await uploader.uploadFile(
          info.fileList[0].originFileObj,
          "workoutStories"
        );
        setUploadedImage(url);
      } catch (error) {
        console.error("Error uploading image:", error);
      } finally {
        setImageUploading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      timestamp: date,
    });
  };

  const handleIntensityChange = (value) => {
    setFormData({
      ...formData,
      intensity: value,
    });
  };

  // Musical design elements
  const musicalNoteStyle = {
    position: 'absolute',
    fontSize: '32px',
    color: 'rgba(106, 17, 203, 0.2)',
    zIndex: 0
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
            Create Music Learning Plan
          </Title>
          {/* Musical note in title */}
          <span style={{ marginLeft: 8, fontSize: 20 }}>♪</span>
        </div>
      }
      open={snap.createWorkoutStatusModalOpened}
      onCancel={() => {
        state.createWorkoutStatusModalOpened = false;
      }}
      width={650}
      bodyStyle={{ 
        padding: '20px', 
        backgroundColor: themeColors.background,
        borderRadius: '10px'
      }}
      footer={null}
      centered
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
          maxHeight: '70vh',  // Limit height
          overflow: 'auto',   // Enable scrolling
          position: 'relative',
          zIndex: 1
        }}
      >
        <Form 
          form={form} 
          layout="vertical"
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '16px' 
          }}
        >
          {/* Rearranged form layout - Main fields first */}
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <EditOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                  Song Title/Piece
                </span>
              } name="title" rules={[{ required: true, message: 'Please input a title' }]}>
                <Input
                  placeholder="Enter song or piece title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <TagOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                  Music Style/Instrument
                </span>
              } name="exerciseType">
                <Input
                  placeholder="Piano, Guitar, Jazz, Classical, etc."
                  name="exerciseType"
                  value={formData.exerciseType}
                  onChange={handleInputChange}
                  style={{ borderRadius: '6px' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                  Practice Date
                </span>
              } name="timestamp">
                <DatePicker
                  placeholder="Select date"
                  style={{ width: "100%", borderRadius: '6px' }}
                  value={formData.timestamp}
                  onChange={handleDateChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <FireOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                  Difficulty Level
                </span>
              } name="intensity">
                <Select
                  placeholder="Select difficulty level"
                  style={{ width: "100%", borderRadius: '6px' }}
                  value={formData.intensity}
                  onChange={handleIntensityChange}
                  suffixIcon={<FireOutlined style={{ color: themeColors.primary }} />}
                  dropdownStyle={{ borderRadius: '6px' }}
                >
                  <Option value="No Efforts">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FireOutlined style={{ color: '#6A11CB', marginRight: '8px' }} />
                      Beginner
                    </div>
                  </Option>
                  <Option value="Mid Efforts">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FireOutlined style={{ color: '#8E44AD', marginRight: '8px' }} />
                      Early Intermediate
                    </div>
                  </Option>
                  <Option value="Moderate Efforts">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FireOutlined style={{ color: '#B39DDB', marginRight: '8px' }} />
                      Intermediate
                    </div>
                  </Option>
                  <Option value="Severe Efforts">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FireOutlined style={{ color: '#2575FC', marginRight: '8px' }} />
                      Advanced
                    </div>
                  </Option>
                  <Option value="Maximal Efforts">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <FireOutlined style={{ color: '#722ed1', marginRight: '8px' }} />
                      Professional
                    </div>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item 
            label={
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <ClockCircleOutlined style={{ marginRight: '8px', color: themeColors.primary }} />
                  Practice Duration
                </span>
                <Text 
                  strong 
                  style={{ 
                    color: getIntensityColor(formData.timeDuration),
                  }}
                >
                  {formData.timeDuration} minutes
                </Text>
              </div>
            }
            name="timeDuration"
            style={{ marginBottom: 0 }}
          >
            <div style={{ 
              backgroundColor: themeColors.lightAccent,
              padding: '16px',
              borderRadius: '8px',
              border: `1px solid ${themeColors.border}`,
              position: 'relative'
            }}>
              {/* Small decorative quarter note */}
              <span style={{ 
                position: 'absolute', 
                right: 10, 
                bottom: 10, 
                fontSize: '18px', 
                color: 'rgba(106, 17, 203, 0.15)' 
              }}>♩</span>
              
              <Slider
                min={0}
                max={120}
                step={15}
                value={formData.timeDuration}
                marks={durationMarks}
                tooltip={{ formatter: value => `${value} min` }}
                onChange={(value) => {
                  setFormData({
                    ...formData,
                    timeDuration: value,
                  });
                }}
                trackStyle={{ background: themeColors.gradient }}
                handleStyle={{ borderColor: themeColors.primary, background: themeColors.primary }}
              />
            </div>
          </Form.Item>

          <Form.Item label={
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '8px', color: themeColors.primary, fontSize: '16px' }}>♪</span>
              Practice Notes
            </span>
          } name="description">
            <Input.TextArea
              placeholder="Add details about techniques, skills, or goals for this practice session..."
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>
          
          <Divider style={{ margin: '8px 0', background: themeColors.border }} />
          
          {/* Image upload moved to bottom */}
          <Row gutter={24}>
            <Col span={24}>
              {uploadedImage ? (
                <div style={{ 
                  borderRadius: '10px', 
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(106,17,203,0.08)',
                  marginBottom: '16px',
                  position: 'relative'
                }}>
                  <img
                    style={{ 
                      width: "100%", 
                      height: "220px",
                      objectFit: 'cover'
                    }}
                    src={uploadedImage}
                    alt="Music Learning Plan"
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
                      accept="image/*"
                      onChange={handleFileChange}
                      showUploadList={false}
                      beforeUpload={() => false}
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
                        Change Image
                      </Button>
                    </Upload>
                  </div>
                </div>
              ) : (
                <div style={{
                  marginBottom: '16px',
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
                    <Text>Uploading image...</Text>
                  ) : (
                    <Upload
                      accept="image/*"
                      onChange={handleFileChange}
                      showUploadList={false}
                      beforeUpload={() => false}
                    >
                      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                        <UploadOutlined style={{ fontSize: '24px', color: themeColors.primary, marginBottom: '8px' }} />
                        <div>
                          <Text strong>Upload Sheet Music or Instrument</Text>
                          <br />
                        </div>
                      </div>
                    </Upload>
                  )}
                </div>
              )}
            </Col>
          </Row>
          
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginTop: '16px'
            }}
          >
            <Button 
              key="cancel" 
              onClick={() => (state.createWorkoutStatusModalOpened = false)}
              style={{
                borderRadius: '6px',
              }}
            >
              Cancel
            </Button>
            <Button
              loading={loading}
              key="create"
              type="primary"
              onClick={handleCreateWorkoutStory}
              style={{
                background: themeColors.gradient,
                borderColor: themeColors.primary,
                borderRadius: '6px',
                boxShadow: "0 2px 8px rgba(106, 17, 203, 0.3)"
              }}
            >
              Create Music Learning Plan
            </Button>
          </div>
        </Form>
      </Card>
    </Modal>
  );
};

export default CreateStoryModal;