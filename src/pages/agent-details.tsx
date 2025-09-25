/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  Activity,
  ArrowLeft,
  Bot,
  Clock,
  Edit,
  MessageSquare,
  Pause,
  Play,
  Zap,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const agentData = {
  1: {
    id: 1,
    name: "Customer Support Bot",
    type: "Support",
    status: "active",
    model: "GPT-4",
    requests: 1247,
    lastActive: "2 minutes ago",
    accuracy: 94,
    description:
      "Advanced customer support agent that handles inquiries, resolves issues, and escalates complex problems to human agents when necessary.",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    metrics: {
      totalRequests: 1247,
      successfulRequests: 1172,
      averageResponseTime: "1.2s",
      uptime: "99.8%",
    },
    recentActivity: [
      {
        time: "2 minutes ago",
        action: "Resolved customer inquiry about billing",
      },
      {
        time: "5 minutes ago",
        action: "Escalated technical issue to support team",
      },
      {
        time: "8 minutes ago",
        action: "Provided product information to customer",
      },
      { time: "12 minutes ago", action: "Processed refund request" },
    ],
  },
};

export function AgentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  //@ts-ignore
  const agent = agentData[id as keyof typeof agentData];

  if (!agent) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold">Agent Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The requested agent could not be found.
        </p>
        <Button onClick={() => navigate("/agents")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Agents
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/agents")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-4 flex-1">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              <Bot className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{agent.name}</h1>
            <p className="text-muted-foreground">{agent.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={agent.status === "active" ? "default" : "secondary"}
              className={
                agent.status === "active" ? "bg-green-100 text-green-800" : ""
              }
            >
              {agent.status}
            </Badge>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              {agent.status === "active" ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Requests
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agent.metrics.totalRequests.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agent.accuracy}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agent.metrics.averageResponseTime}
            </div>
            <p className="text-xs text-muted-foreground">
              -0.3s from last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agent.metrics.uptime}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Agent Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Type:</span>
                  <Badge variant="outline">{agent.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Model:</span>
                  <span className="text-sm">{agent.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Created:</span>
                  <span className="text-sm">{agent.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Last Updated:</span>
                  <span className="text-sm">{agent.updatedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Last Active:</span>
                  <span className="text-sm">{agent.lastActive}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    Successful Requests:
                  </span>
                  <span className="text-sm">
                    {agent.metrics.successfulRequests.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Failed Requests:</span>
                  <span className="text-sm">
                    {(
                      agent.metrics.totalRequests -
                      agent.metrics.successfulRequests
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">
                    Average Response Time:
                  </span>
                  <span className="text-sm">
                    {agent.metrics.averageResponseTime}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Uptime:</span>
                  <span className="text-sm">{agent.metrics.uptime}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest actions performed by this agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agent.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Settings</CardTitle>
              <CardDescription>
                Configure agent behavior and parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Auto-escalation</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically escalate complex issues
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Response Templates</h4>
                    <p className="text-sm text-muted-foreground">
                      Manage predefined responses
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Training Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Update agent knowledge base
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
