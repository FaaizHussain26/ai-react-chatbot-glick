"use client";
import {
    Activity,
    Bot,
    Clock,
    Edit,
    Eye,
    MoreHorizontal,
    Pause,
    Play,
    Trash2,
    Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const data = {
  agents: [
    {
      id: 1,
      name: "Customer Support Bot",
      type: "Support",
      status: "active",
      model: "GPT-4",
      requests: 1247,
      lastActive: "2 minutes ago",
      accuracy: 94,
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
    },
  ],
  stats: [
    {
      title: "Total Agents",
      value: "24",
      change: "+2 from last month",
      icon: Bot,
    },
    {
      title: "Active Requests",
      value: "2,847",
      change: "+12% from yesterday",
      icon: Activity,
    },
    {
      title: "Response Time",
      value: "1.2s",
      change: "-0.3s from last week",
      icon: Clock,
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "+2.1% from last month",
      icon: Zap,
    },
  ],
};

export function DashboardPage() {
  const navigate = useNavigate();

  const handleAgentClick = (agentId: number) => {
    navigate(`/agents/${agentId}`);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Agents Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent AI Agents</CardTitle>
              <CardDescription>
                Your most recently active agents
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate("/agents")}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
              {data.agents.map((agent) => (
                <TableRow
                  key={agent.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell
                    className="font-medium"
                    onClick={() => handleAgentClick(agent.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      {agent.name}
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
    </div>
  );
}
