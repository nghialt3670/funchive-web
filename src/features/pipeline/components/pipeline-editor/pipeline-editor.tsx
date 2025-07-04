import { useGetFunctionPageQuery } from "@/features/function/hooks";
import type { FunctionDetailDto } from "@/features/function/types";
import {
  ArrowLeftOutlined,
  DragOutlined,
  FunctionOutlined,
  PlayCircleFilled,
  SaveFilled,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Divider,
  Drawer,
  Input,
  List,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  type Connection,
  Controls,
  type Edge,
  Handle,
  MarkerType,
  MiniMap,
  type Node,
  Position,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  useExecutePipeline,
  usePipelineDetail,
  useUpdatePipeline,
} from "../../pipeline-hooks";
import type {
  FunctionNode,
  Connection as PipelineConnection,
  Node as PipelineNode,
  ValueNode,
} from "../../pipeline-types";
import styles from "./pipeline-editor.module.css";

const { Text } = Typography;

// Custom node types for ReactFlow
const FunctionNodeComponent = ({ data }: { data: any }) => {
  return (
    <div className={styles.functionNode}>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className={styles.nodeHandle}
      />
      <div className={styles.nodeHeader}>
        <FunctionOutlined />
        <span className={styles.nodeTitle}>
          {data.functionDetail?.definition.name}
        </span>
      </div>
      <div className={styles.nodeDescription}>
        {data.functionDetail?.definition.description}
      </div>
      <div className={styles.nodeLanguage}>
        <Tag color="blue">{data.functionDetail?.implementation.language}</Tag>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className={styles.nodeHandle}
      />
    </div>
  );
};

const ValueNodeComponent = ({ data }: { data: any }) => {
  return (
    <div className={styles.valueNode}>
      <div className={styles.nodeHeader}>
        <span className={styles.nodeTitle}>{data.name}</span>
      </div>
      <div className={styles.nodeDescription}>{data.valueType || "Value"}</div>
      <div className={styles.valueTypeInfo}>
        <Tag color="green">{data.valueType || "ANY"}</Tag>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className={styles.nodeHandle}
      />
    </div>
  );
};

const InputNodeComponent = ({ data }: { data: any }) => {
  return (
    <div className={styles.inputNode}>
      <div className={styles.nodeHeader}>
        <span className={styles.nodeTitle}>Input</span>
      </div>
      <div className={styles.nodeDescription}>
        {data.label || "Pipeline Input"}
      </div>
      <div className={styles.inputTypeInfo}>
        <Tag color="green">{data.inputType || "ANY"}</Tag>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className={styles.nodeHandle}
      />
    </div>
  );
};

const OutputNodeComponent = ({ data }: { data: any }) => {
  return (
    <div className={styles.outputNode}>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className={styles.nodeHandle}
      />
      <div className={styles.nodeHeader}>
        <span className={styles.nodeTitle}>Output</span>
      </div>
      <div className={styles.nodeDescription}>
        {data.label || "Pipeline Output"}
      </div>
      <div className={styles.outputTypeInfo}>
        <Tag color="orange">{data.outputType || "ANY"}</Tag>
      </div>
    </div>
  );
};

const nodeTypes = {
  function: FunctionNodeComponent,
  value: ValueNodeComponent,
  input: InputNodeComponent,
  output: OutputNodeComponent,
};

interface PipelineEditorProps {
  pipelineId?: string;
  onBack?: () => void;
}

const PipelineEditorComponent: React.FC<PipelineEditorProps> = ({
  pipelineId,
  onBack,
}) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [pipelineName, setPipelineName] = useState("Untitled Pipeline");
  const [functionsDrawerOpen, setFunctionsDrawerOpen] = useState(true);
  const { screenToFlowPosition } = useReactFlow();

  // Hooks for API operations
  const { data: pipeline, isLoading: pipelineLoading } = usePipelineDetail(
    pipelineId || "",
    !!pipelineId,
  );
  const updatePipeline = useUpdatePipeline();
  const executePipeline = useExecutePipeline();

  // Load pipeline data
  useEffect(() => {
    if (pipeline) {
      setPipelineName(pipeline.name);

      // Convert pipeline nodes to ReactFlow nodes
      const reactFlowNodes: Node[] = pipeline.nodes.map((node) => {
        if (node.nodeType === "FUNCTION") {
          const funcNode = node as FunctionNode;
          return {
            id: node.id,
            type: "function",
            position: node.position,
            data: {
              functionId: funcNode.functionId,
              // TODO: Load function details
            },
          };
        } else {
          const valueNode = node as ValueNode;
          return {
            id: node.id,
            type: "value",
            position: node.position,
            data: {
              name: node.name,
              value: valueNode.value,
              valueType: valueNode.value.type,
            },
          };
        }
      });

      // Convert pipeline connections to ReactFlow edges
      const reactFlowEdges: Edge[] = pipeline.connections.map((connection) => ({
        id: connection.id,
        source: connection.sourceNodeId,
        target: connection.targetNodeId,
        sourceHandle: connection.sourcePort || "output",
        targetHandle: connection.targetPort || "input",
        animated: true,
        style: { stroke: "#1890ff", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#1890ff",
        },
      }));

      setNodes(reactFlowNodes);
      setEdges(reactFlowEdges);
    }
  }, [pipeline, setNodes, setEdges]);

  // Handle edge deletion
  const onEdgesDelete = useCallback(
    (edgesToDelete: Edge[]) => {
      setEdges((eds) =>
        eds.filter((edge) => !edgesToDelete.some((e) => e.id === edge.id)),
      );
      message.info(`Deleted ${edgesToDelete.length} connection(s)`);
    },
    [setEdges],
  );

  // Validate connections to prevent invalid connections
  const isValidConnection = useCallback(
    (connection: Connection) => {
      // Prevent connecting to the same node
      if (connection.source === connection.target) {
        message.warning("Cannot connect a node to itself");
        return false;
      }

      // Prevent duplicate connections
      const existingConnection = edges.find(
        (edge) =>
          edge.source === connection.source &&
          edge.target === connection.target &&
          edge.sourceHandle === connection.sourceHandle &&
          edge.targetHandle === connection.targetHandle,
      );

      if (existingConnection) {
        message.warning("Connection already exists");
        return false;
      }

      return true;
    },
    [edges],
  );

  // Fetch available functions
  const { data: functionsPage, isLoading: functionsLoading } =
    useGetFunctionPageQuery(
      {},
      { page: 0, size: 100, sort: "definition.name,asc" },
    );

  const availableFunctions = useMemo(() => {
    return (
      functionsPage?.items.filter(
        (func) => func.compilationStatus === "SUCCESS",
      ) || []
    );
  }, [functionsPage]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      // Ensure we have valid source and target
      if (!params.source || !params.target) {
        return;
      }

      // Create a styled edge with proper arrow markers
      const newEdge: Edge = {
        id: `${params.source}-${params.sourceHandle || ""}-to-${params.target}-${params.targetHandle || ""}`,
        source: params.source,
        target: params.target,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        animated: true,
        style: {
          stroke: "#1890ff",
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#1890ff",
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
      message.success("Connection created successfully!");
    },
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const functionData = event.dataTransfer.getData("application/json");
      if (!functionData) {
        return;
      }

      const func: FunctionDetailDto = JSON.parse(functionData);

      if (!reactFlowWrapper.current) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const functionNodeId = `function-${func.id}-${Date.now()}`;
      const inputNodeId = `input-${functionNodeId}`;
      const outputNodeId = `output-${functionNodeId}`;

      // Create function node
      const functionNode: Node = {
        id: functionNodeId,
        type: "function",
        position,
        data: { functionDetail: func, functionId: func.id },
      };

      // Create input node (connected to function)
      const inputNode: Node = {
        id: inputNodeId,
        type: "input",
        position: { x: position.x - 200, y: position.y },
        data: {
          label: `Input for ${func.definition.name}`,
          connectedFunction: functionNodeId,
          inputType: func.definition.inputType.name,
          typeInfo: func.definition.inputType,
        },
      };

      // Create output node (connected from function)
      const outputNode: Node = {
        id: outputNodeId,
        type: "output",
        position: { x: position.x + 200, y: position.y },
        data: {
          label: `Output from ${func.definition.name}`,
          connectedFunction: functionNodeId,
          outputType: func.definition.outputType.name,
          typeInfo: func.definition.outputType,
        },
      };

      // Create edges with proper handle connections
      const inputEdge: Edge = {
        id: `${inputNodeId}-to-${functionNodeId}`,
        source: inputNodeId,
        sourceHandle: "output",
        target: functionNodeId,
        targetHandle: "input",
        animated: true,
        style: { stroke: "#52c41a", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#52c41a",
        },
      };

      const outputEdge: Edge = {
        id: `${functionNodeId}-to-${outputNodeId}`,
        source: functionNodeId,
        sourceHandle: "output",
        target: outputNodeId,
        targetHandle: "input",
        animated: true,
        style: { stroke: "#fa8c16", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#fa8c16",
        },
      };

      setNodes((nds) => nds.concat([functionNode, inputNode, outputNode]));
      setEdges((eds) => eds.concat([inputEdge, outputEdge]));

      message.success(`Added ${func.definition.name} to pipeline`);
    },
    [screenToFlowPosition, setNodes, setEdges],
  );

  const onDragStart = (event: React.DragEvent, func: FunctionDetailDto) => {
    event.dataTransfer.setData("application/json", JSON.stringify(func));
    event.dataTransfer.effectAllowed = "move";
  };

  const handleSave = useCallback(async () => {
    if (!pipeline) {
      message.error("No pipeline to save");
      return;
    }

    try {
      // Convert ReactFlow nodes back to pipeline nodes
      const pipelineNodes: PipelineNode[] = nodes.map((node) => {
        if (node.type === "function") {
          return {
            id: node.id,
            nodeType: "FUNCTION" as const,
            name: node.data.functionDetail?.definition.name || "Function",
            position: node.position,
            functionId: node.data.functionId,
          } as FunctionNode;
        } else {
          return {
            id: node.id,
            nodeType: "VALUE" as const,
            name: node.data.name || "Value",
            position: node.position,
            value: node.data.value || { type: "STRING", data: "" },
          } as ValueNode;
        }
      });

      // Convert ReactFlow edges back to pipeline connections
      const pipelineConnections: PipelineConnection[] = edges.map((edge) => ({
        id: edge.id,
        sourceNodeId: edge.source,
        targetNodeId: edge.target,
        sourcePort: edge.sourceHandle || undefined,
        targetPort: edge.targetHandle || undefined,
      }));

      await updatePipeline.mutateAsync({
        pipelineId: pipeline.id,
        data: {
          name: pipelineName,
          description: pipeline.description,
          nodes: pipelineNodes,
          connections: pipelineConnections,
        },
      });

      message.success("Pipeline saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
    }
  }, [pipeline, nodes, edges, pipelineName, updatePipeline]);

  const handleRun = useCallback(async () => {
    if (!pipeline) {
      message.error("No pipeline to execute");
      return;
    }

    try {
      await executePipeline.mutateAsync({
        pipelineId: pipeline.id,
        executionData: { inputs: {} }, // TODO: Collect proper inputs
      });
    } catch (error) {
      console.error("Execution error:", error);
    }
  }, [pipeline, executePipeline]);

  if (pipelineLoading) {
    return <Card loading style={{ height: "100vh" }} />;
  }

  return (
    <div className={styles.pipelineEditor}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {onBack && (
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              className={styles.backButton}
            ></Button>
          )}
          <div className={styles.titleSection}>
            <Input
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              className={styles.pipelineNameInput}
              placeholder="Pipeline name"
            />
          </div>
        </div>
        <Space>
          <Button
            icon={<PlayCircleFilled />}
            onClick={handleRun}
            disabled={nodes.length === 0}
            loading={executePipeline.isPending}
          >
            Run
          </Button>
          <Button
            type="primary"
            icon={<SaveFilled />}
            onClick={handleSave}
            disabled={nodes.length === 0}
            loading={updatePipeline.isPending}
          >
            Save
          </Button>
        </Space>
      </div>

      {/* Main Canvas Area */}
      <div className={styles.canvasContainer}>
        <div className={styles.reactFlowWrapper} ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgesDelete={onEdgesDelete}
            onDrop={onDrop}
            onDragOver={onDragOver}
            isValidConnection={isValidConnection}
            nodeTypes={nodeTypes}
            fitView
            deleteKeyCode={["Backspace", "Delete"]}
            className={styles.reactFlow}
          >
            <Controls />
            <MiniMap />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>

        {/* Functions Drawer */}
        <Drawer
          title="Available Functions"
          placement="right"
          width={350}
          open={functionsDrawerOpen}
          onClose={() => setFunctionsDrawerOpen(false)}
          getContainer={false}
          style={{ position: "absolute" }}
          mask={false}
        >
          <div className={styles.functionsPanel}>
            <Text type="secondary" className={styles.instructionText}>
              <DragOutlined /> Drag functions to the canvas to add them to your
              pipeline
            </Text>
            <Divider />

            <List
              loading={functionsLoading}
              dataSource={availableFunctions}
              renderItem={(func) => (
                <List.Item className={styles.functionListItem}>
                  <Card
                    size="small"
                    className={styles.draggableFunctionCard}
                    draggable
                    onDragStart={(event) => onDragStart(event, func)}
                  >
                    <div className={styles.functionCardContent}>
                      <div className={styles.functionName}>
                        <FunctionOutlined />
                        <span>{func.definition.name}</span>
                      </div>
                      <div className={styles.functionDescription}>
                        {func.definition.description}
                      </div>
                      <div className={styles.functionMeta}>
                        <Tag color="blue">{func.implementation.language}</Tag>
                        <Tag color="green">Compiled</Tag>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
              locale={{
                emptyText: "No compiled functions available",
              }}
            />
          </div>
        </Drawer>

        {/* Toggle Functions Panel Button */}
        {!functionsDrawerOpen && (
          <Button
            className={styles.toggleFunctionsButton}
            icon={<FunctionOutlined />}
            onClick={() => setFunctionsDrawerOpen(true)}
          >
            Functions
          </Button>
        )}
      </div>
    </div>
  );
};

export const PipelineEditor: React.FC<PipelineEditorProps> = (props) => {
  return (
    <ReactFlowProvider>
      <PipelineEditorComponent {...props} />
    </ReactFlowProvider>
  );
};
