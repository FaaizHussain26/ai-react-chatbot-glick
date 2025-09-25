import {
  Bot,
  Edit,
  Eye,
  Filter,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const allAgents = [
  {
    id: 1,
    name: "Customer Support Bot",
    type: "Support",
    status: "active",
    model: "GPT-4",
    requests: 1247,
    lastActive: "2 minutes ago",
    accuracy: 94,
    description: "Handles customer inquiries and support tickets",
  },
  {
    id: 2,
    name: "Sales Assistant",
    type: "Sales",
    status: "active",
    model: "Claude-3",
    requests: 892,
    lastActive: "5 minutes ago",
    accuracy: 89,
    description: "Assists with lead qualification and sales processes",
  },
  {
    id: 3,
    name: "Content Generator",
    type: "Content",
    status: "paused",
    model: "GPT-4",
    requests: 456,
    lastActive: "1 hour ago",
    accuracy: 96,
    description: "Creates marketing content and blog posts",
  },
  {
    id: 4,
    name: "Data Analyzer",
    type: "Analytics",
    status: "active",
    model: "Gemini Pro",
    requests: 234,
    lastActive: "10 minutes ago",
    accuracy: 91,
    description: "Analyzes data patterns and generates insights",
  },
  {
    id: 5,
    name: "Email Assistant",
    type: "Support",
    status: "active",
    model: "GPT-4",
    requests: 678,
    lastActive: "1 minute ago",
    accuracy: 92,
    description: "Manages email responses and scheduling",
  },
  {
    id: 6,
    name: "Code Reviewer",
    type: "Development",
    status: "paused",
    model: "Claude-3",
    requests: 123,
    lastActive: "3 hours ago",
    accuracy: 88,
    description: "Reviews code and suggests improvements",
  },
];

export function AgentsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const handleAgentClick = (agentId: number) => {
    navigate(`/agents/${agentId}`);
  };

  const filteredAgents = allAgents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.type.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchesSearch;
    if (activeTab === "active")
      return matchesSearch && agent.status === "active";
    if (activeTab === "paused")
      return matchesSearch && agent.status === "paused";

    return matchesSearch;
  });

  const activeAgents = allAgents.filter(
    (agent) => agent.status === "active"
  ).length;
  const pausedAgents = allAgents.filter(
    (agent) => agent.status === "paused"
  ).length;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Agents</h2>
          <p className="text-muted-foreground">
            Manage and monitor all your AI agents
          </p>
        </div>
        <Button onClick={() => navigate("/agents/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Agent
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Agents ({allAgents.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeAgents})</TabsTrigger>
          <TabsTrigger value="paused">Paused ({pausedAgents})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Model</TableHead>
                    <TableHead>Requests</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAgents.map((agent) => (
                    <TableRow
                      key={agent.id}
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell
                        className="font-medium"
                        onClick={() => handleAgentClick(agent.id)}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>
                              <Bot className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {agent.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell onClick={() => handleAgentClick(agent.id)}>
                        <Badge variant="outline">{agent.type}</Badge>
                      </TableCell>
                      <TableCell onClick={() => handleAgentClick(agent.id)}>
                        <Badge
                          variant={
                            agent.status === "active" ? "default" : "secondary"
                          }
                          className={
                            agent.status === "active"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {agent.status}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={() => handleAgentClick(agent.id)}>
                        {agent.model}
                      </TableCell>
                      <TableCell onClick={() => handleAgentClick(agent.id)}>
                        {agent.requests.toLocaleString()}
                      </TableCell>
                      <TableCell onClick={() => handleAgentClick(agent.id)}>
                        {agent.accuracy}%
                      </TableCell>
                      <TableCell
                        className="text-muted-foreground"
                        onClick={() => handleAgentClick(agent.id)}
                      >
                        {agent.lastActive}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleAgentClick(agent.id)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {agent.status === "active" ? (
                                <>
                                  <Pause className="mr-2 h-4 w-4" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 h-4 w-4" />
                                  Start
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
