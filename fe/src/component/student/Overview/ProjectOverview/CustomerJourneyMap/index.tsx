import React, { useState } from "react";
import {
  Card,
  Typography,
  Tooltip,
  message,
  Modal,
  Select,
  Button,
  Input,
  Skeleton,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { customerJourneyMapApi } from "../../../../../api/apiOverview/customerJourneyMap";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import TextArea from "antd/es/input/TextArea";

import { QUERY_KEY } from "../../../../../utils/const";

const { Title } = Typography;
const { Option } = Select;

interface Cols {
  _id: string;
  name: string;
  color: string;
}

interface Rows {
  _id: string;
  name: string;
}

interface Cell {
  _id: string;
  row: string;
  col: string;
  content: string;
}
interface CustomerJourneyMapProps {
  groupId: string; 
}
const colorOptions = [
  "#b2e5c6",
  "#add998",
  "#a1e1d4",
  "#ce93d0",
  "#f081ab",
  "#69baee",
  "#edd37e",
  "#86efac",
];

function lightenColor(color: string, percent: number) {
  if (color.startsWith("rgb")) {
    const rgbValues = color.match(/\d+/g)?.map(Number);
    if (!rgbValues || rgbValues.length < 3) return color;

    const [r, g, b] = rgbValues;
    const hex =
      "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    color = hex;
  }

  const num = parseInt(color.slice(1), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt;

  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

const CustomerJourneyMap: React.FC<CustomerJourneyMapProps> = ({groupId}) => {
  const [isRowModalVisible, setIsRowModalVisible] = useState(false);
  const [isColModalVisible, setIsColModalVisible] = useState(false);
  const [isCellModalVisible, setIsCellModalVisible] = useState(false);
  const [currentCol, setCurrentCol] = useState<Cols | null>(null);
  const [currentRow, setCurrentRow] = useState<Rows | null>(null);
  const [currentCell, setCurrentCell] = useState<Cell | null>(null);
  const [newColName, setNewColName] = useState("");
  const [newColColor, setNewColColor] = useState("");
  const [cellContent, setCellContent] = useState("");
  const queryClient = useQueryClient();
  const { data: customerJourneyMapData, isLoading } = useQuery({
    queryKey: [QUERY_KEY.GROUP_CUSTOMER_JOURNEY_MAP, groupId],
    queryFn: async () => {
      return await customerJourneyMapApi.getGroupData(groupId);
    },
  });
  const editColumnMutation = useMutation({
    mutationFn: (editedCol: {
      colId: string;
      colName: string;
      color: string;
    }) =>
      customerJourneyMapApi.updateColumnCustomerJourneyMap(
        groupId,
        editedCol.colId,
        editedCol.colName,
        editedCol.color
      ),
    onSuccess: () => {
      message.success("Column updated successfully");
      setIsColModalVisible(false);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.GROUP_CUSTOMER_JOURNEY_MAP],
      });
    },
    onError: () => {
      message.error("Failed to update column.");
    },
  });

  const deleteColMutation = useMutation({
    mutationFn: (colId: string) =>
      customerJourneyMapApi.deleteColContentCustomerJourneyMap(groupId, colId),
    onSuccess: () => {
      message.success("Column deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.GROUP_CUSTOMER_JOURNEY_MAP],
      });
      setIsColModalVisible(false);
    },
    onError: () => {
      message.error("Failed to delete column.");
    },
  });

  const editRowMutation = useMutation({
    mutationFn: (editedRow: { rowId: string; rowName: string }) =>
      customerJourneyMapApi.updateRowCustomerJourneyMap(
        groupId,
        editedRow.rowId,
        editedRow.rowName
      ),
    onSuccess: () => {
      message.success("Row updated successfully");
      setIsRowModalVisible(false);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.GROUP_CUSTOMER_JOURNEY_MAP],
      });
    },
    onError: () => {
      message.error("Failed to update row.");
    },
  });

  const deleteRowMutation = useMutation({
    mutationFn: (rowId: string) =>
      customerJourneyMapApi.deleteRowContentCustomerJourneyMap(groupId, rowId),
    onSuccess: () => {
      message.success("Row deleted successfully");
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.GROUP_CUSTOMER_JOURNEY_MAP],
      });
      setIsRowModalVisible(false);
    },
    onError: () => {
      message.error("Failed to delete row.");
    },
  });

  const editCellMutation = useMutation({
    mutationFn: (updatedCell: { cellId: string; content: string }) =>
      customerJourneyMapApi.updateCellContentCustomerJourneyMap(
        groupId,
        updatedCell.cellId,
        updatedCell.content
      ),
    onSuccess: () => {
      message.success("Cell updated successfully");
      setIsCellModalVisible(false);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.GROUP_CUSTOMER_JOURNEY_MAP],
      });
    },
    onError: () => {
      message.error("Failed to update cell.");
    },
  });

  const addColumnMutation = useMutation({
    mutationFn: () => customerJourneyMapApi.createColumn(groupId),
    onSuccess: (data) => {
      if (data.data?.message) {
        message.success(data.data?.message);
      }
    },
    onError: () => {
      message.error("Failed to add column.");
    },
  });

  const addRowMutation = useMutation({
    mutationFn: () => customerJourneyMapApi.createRow(groupId),
    onSuccess: (data) => {
      if (data.data?.message) {
        message.success(data.data?.message);
      }
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.GROUP_CUSTOMER_JOURNEY_MAP],
      });
    },
    onError: () => {
      message.error("Failed to add row.");
    },
  });

  const getContentForCell = (rowId: string, colId: string) => {
    const cell =
      customerJourneyMapData?.data?.data?.customerJourneyMap?.cells.find(
        (cell: any) => cell.row === rowId && cell.col === colId
      );
    return cell ? cell.content : "No content available";
  };

  const handleAddColumn = () => {
    addColumnMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.GROUP_CUSTOMER_JOURNEY_MAP],
        });
        message.success("Column added successfully");
      },
      onError: () => {
        message.error("Failed to add column.");
      },
    });
  };

  const handleDeleteColumn = () => {
    if (currentCol) {
      Modal.confirm({
        title: "Are you sure you want to delete this row?",
        content: "Once deleted, the data cannot be recovered.",
        okText: "Yes, delete it",
        okType: "danger",
        cancelText: "No",
        onOk: () => {
          deleteColMutation.mutate(currentCol._id);
        },
      });
    }
  };

  const handleAddRow = () => {
    addRowMutation.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.GROUP_CUSTOMER_JOURNEY_MAP],
        });
        message.success("Row added successfully");
      },
      onError: () => {
        message.error("Failed to add row.");
      },
    });
  };

  const handleDeleteRow = () => {
    if (currentRow) {
      Modal.confirm({
        title: "Are you sure you want to delete this row?",
        content: "Once deleted, the data cannot be recovered.",
        okText: "Yes, delete it",
        okType: "danger",
        cancelText: "No",
        onOk: () => {
          deleteRowMutation.mutate(currentRow._id);
        },
      });
    }
  };

  const showEditColModal = (col: Cols) => {
    setCurrentCol(col);
    setNewColName(col.name);
    setNewColColor(col.color);
    setIsColModalVisible(true);
  };

  const showEditRowModal = (row: Rows) => {
    setCurrentRow(row);
    setNewColName(row.name);
    setIsRowModalVisible(true);
  };

  const showEditCellModal = (cell: Cell) => {
    setCurrentCell(cell);
    setCellContent(cell.content);
    setIsCellModalVisible(true);
  };

  const handleEditColumn = () => {
    if (currentCol) {
      editColumnMutation.mutate({
        colId: currentCol._id,
        colName: newColName,
        color: newColColor,
      });
    }
  };

  const handleEditRow = () => {
    if(newColName == ''){
      message.error("Row name cannot be empty!");
    }
    if (currentRow && newColName != '') {
      editRowMutation.mutate({
        rowId: currentRow._id,
        rowName: newColName,
      });
    }
  };

  const handleEditCell = () => {
    if(cellContent == ''){
      message.error("Content cannot be empty!");
    }
    if (currentCell && cellContent != '') {
      editCellMutation.mutate({
        cellId: currentCell._id,
        content: cellContent,
      });
    }
  };

  if (isLoading)
    return (
      <div className="bg-white rounded p-4">
        <Skeleton />
      </div>
    );

  return (
    <div className="bg-white p-4 w-full rounded">
      <Title level={4} className="text-xl font-bold mb-5">
        Customer Journey Map
      </Title>
      <div className="flex">
        <div className="flex-1">
          <Card
            style={{ backgroundColor: "#D9D9D9" }}
            className="text-center font-semibold h-20"
          >
            STAGE
          </Card>
        </div>
        {customerJourneyMapData?.data?.data?.customerJourneyMap?.cols.map(
          (col: any) => (
            <div className="flex-1" key={col._id}>
              <Card
                className="text-center font-semibold uppercase h-20 overflow-hidden"
                style={{ backgroundColor: col.color }}
                onClick={() => showEditColModal(col)}
              >
                {col.name}
              </Card>
            </div>
          )
        )}
        {customerJourneyMapData?.data?.data?.customerJourneyMap?.cols.length <
          7 && (
          <div className="flex-1">
            <Card
              onClick={handleAddColumn}
              className="cursor-pointer flex-1 text-center hover:bg-violet-400 hover:text-white h-20"
            >
              <PlusOutlined /> Create new col
            </Card>
          </div>
        )}
      </div>
      {customerJourneyMapData?.data?.data?.customerJourneyMap?.rows.map(
        (row: any, rowIndex: any) => (
          <div className="flex my-1" key={row._id}>
            <div className="flex-1">
              <Card
                className="text-center uppercase font-bold h-20 shadow items-center overflow-hidden"
                onClick={() => showEditRowModal(row)}
              >
                {row.name}
              </Card>
            </div>
            {customerJourneyMapData?.data?.data?.customerJourneyMap?.cols.map(
              (col: any) => (
                <div className="flex-1" key={col._id}>
                  <Tooltip
                    overlayStyle={{
                      whiteSpace: "normal",
                    }}
                    title={
                      <span style={{ color: "#000000" }}>
                        {getContentForCell(row._id, col._id)}
                      </span>
                    }
                    placement="top"
                    color={col.color}
                  >
                    <Card
                      className="h-20 shadow"
                      style={{
                        backgroundColor: lightenColor(
                          col.color,
                          rowIndex % 2 === 0 ? 20 : 10
                        ),
                      }}
                      onClick={() => {
                        const cell =
                          customerJourneyMapData?.data?.data?.customerJourneyMap?.cells.find(
                            (cell: any) =>
                              cell.row === row._id && cell.col === col._id
                          );
                        if (cell) {
                          showEditCellModal(cell);
                        }
                      }}
                    >
                      <div className="line-clamp-2">
                        {getContentForCell(row._id, col._id)}
                      </div>
                    </Card>
                  </Tooltip>
                </div>
              )
            )}
            {customerJourneyMapData?.data?.data?.customerJourneyMap?.cols
              .length < 7 && <div className="flex-1"></div>}
          </div>
        )
      )}

      <div className="flex my-1">
        {customerJourneyMapData?.data?.data?.customerJourneyMap?.rows.length <
          7 && (
          <div className="flex-1">
            <Card
              onClick={handleAddRow}
              className="cursor-pointer flex-1 text-center hover:bg-violet-400 hover:text-white h-20"
            >
              <PlusOutlined /> Create new row
            </Card>
          </div>
        )}
        {customerJourneyMapData?.data?.data?.customerJourneyMap?.cols.map(
          (col: any) => (
            <div className="flex-1" key={col._id}></div>
          )
        )}
        <div className="flex-1"></div>
      </div>
      <Modal
        centered
        title="Edit Column"
        open={isColModalVisible}
        onOk={handleEditColumn}
        onCancel={() => setIsColModalVisible(false)}
        footer={[
          <Button key="delete" danger onClick={handleDeleteColumn}>
            Delete Column
          </Button>,
          <Button key="submit" type="primary" onClick={handleEditColumn}>
            Save
          </Button>,
        ]}
      >
        <Select
          placeholder="Select Color"
          value={newColColor}
          onChange={(value) => setNewColColor(value)}
          className="m-2"
        >
          {colorOptions.map((color) => (
            <Option key={color} value={color}>
              <div
                className="pb-1"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    width: 16,
                    height: 16,
                    backgroundColor: color,
                    borderRadius: "50%",
                  }}
                />
              </div>
            </Option>
          ))}
        </Select>
        <Input
          placeholder="Column Name"
          value={newColName}
          onChange={(e) => setNewColName(e.target.value)}
          className="mb-2 w-96"
        />
      </Modal>
      <Modal
        centered
        title="Edit Row"
        open={isRowModalVisible}
        onOk={handleEditRow}
        onCancel={() => setIsRowModalVisible(false)}
        footer={[
          <Button key="delete" danger onClick={handleDeleteRow}>
            Delete Row
          </Button>,
          <Button key="submit" type="primary" onClick={handleEditRow}>
            Save
          </Button>,
        ]}
      >
        <TextArea
          placeholder="Row Name"
          value={newColName}
          onChange={(e) => setNewColName(e.target.value)}
          rows={5}
        />
      </Modal>
      <Modal
        centered
        title="Edit Cell Content"
        open={isCellModalVisible}
        onOk={handleEditCell}
        onCancel={() => setIsCellModalVisible(false)}
      >
        <TextArea
          placeholder="Edit cell content"
          value={cellContent}
          onChange={(e) => setCellContent(e.target.value)}
          rows={5}
        />
      </Modal>
    </div>
  );
};

export default CustomerJourneyMap;
