import React, { useEffect, useState } from "react";
import { Table, Input, Button, Space } from "antd";
import { SearchOutlined, DownloadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const PlatosListExport = () => {
  const [dishes, setDishes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/dishes")
      .then((res) => res.json())
      .then((data) => {
        setDishes(data);
        setFiltered(data);
      });
  }, []);

  const handleSearch = (value) => {
    const lowerValue = value.toLowerCase();
    const filteredData = dishes.filter((dish) =>
      dish.name.toLowerCase().includes(lowerValue)
    );
    setSearchText(value);
    setFiltered(filteredData);
  };

  const exportToExcel = () => {
    const data = filtered.map((dish) => ({
      ID: dish.id,
      Nombre: dish.name,
      Descripción: dish.description,
      Peso: dish.weight,
      "Costo del Plato": dish.costDish,
      "% Ganancia": dish.profitMargin,
      Precio: dish.price,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Platos");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "lista_de_platos.xlsx");
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Descripción", dataIndex: "description", key: "description" },
    { title: "Peso (g)", dataIndex: "weight", key: "weight" },
    { title: "Costo ($)", dataIndex: "costDish", key: "costDish" },
    { title: "% Ganancia", dataIndex: "profitMargin", key: "profitMargin" },
    { title: "Precio Final ($)", dataIndex: "price", key: "price" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Buscar por nombre"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" icon={<DownloadOutlined />} onClick={exportToExcel}>
          Exportar a Excel
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        pagination={{ pageSize: 8 }}
      />
    </div>
  );
};

export default PlatosListExport;
