import React, { useState, useEffect } from 'react';
import { Button, Layout, Typography, message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import Axios from 'axios';
import { saveAs } from 'file-saver';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text, Link } = Typography;
const { Dragger } = Upload;

const props = {
  name: 'icon',
  multiple: true,
  action: '/api/uploads',
  accept: 'png',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      let taskID = info.file.response.data;
      console.log(taskID);
      setTimeout(async function(){
        saveAs(`/api/uploads/${taskID}`, "icon.zip");
      }, 1500)
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

function App() {
  return (
    <Layout>
      <Header
        style={{
          position: 'fixed',
          zIndex: 1,
          width: '100%',
          textAlign: 'center',
          backgroundColor: 'white'
        }}
      >
        <Title level={1} style={{ padding: '10px' }}>
          iMessage Sticker App Icon Generator
        </Title>
      </Header>
      <Content
        className="site-layout"
        style={{
          padding: '0 50px',
          marginTop: 64,
        }}
      >
        <div
          className="site-layout-background"
          style={{
            padding: 24,
            minHeight: "90vh",
            overflow: "auto"
          }}
        >
          <div className="site-layout-content">
            <Paragraph>
              Generate all the different size icons for xcode iMessage sticker packs. Upload a 1024px x 1024px image and it will download a zip file of all the different sized images.
            </Paragraph>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                band files
              </p>
            </Dragger>
          </div>
        </div>
      </Content>
      <Footer
        style={{
          textAlign: 'center',
        }}
      >
      </Footer>
    </Layout>
  );
}

export default App;