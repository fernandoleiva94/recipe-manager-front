import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axios from '../Axios';

const Categorias = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/categories");
      setCategories(response.data);
    } catch (error) {
      message.error("Error fetching categories");
    }
    setLoading(false);
  };

  const handleAddOrUpdate = async (values) => {
    try {
      if (editingCategory) {
        await axios.put(`http://localhost:8080/api/categories/${editingCategory.id}`, values);
        message.success("Category updated successfully");
      } else {
        await axios.post("http://localhost:8080/api/categories", values);
        message.success("Category added successfully");
      }
      fetchCategories();
      setIsModalOpen(false);
      form.resetFields();
      setEditingCategory(null);
    } catch (error) {
      message.error("Error saving category");
    }
  };

  const handleEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/categories/${id}`);
      message.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      message.error("Error deleting category");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)} danger style={{ marginLeft: 10 }}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
        Add Category
      </Button>
      <Table columns={columns} dataSource={categories} loading={loading} rowKey="id" />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrUpdate}>
          <Form.Item name="description" label="Category Description" rules={[{ required: true, message: "Please enter a description" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categorias;
