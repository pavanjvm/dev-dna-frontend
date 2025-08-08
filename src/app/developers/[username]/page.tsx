
"use client"

import { useEffect, useState } from 'react';
import { getDeveloperByUsername, Developer } from '@/lib/developers';
import { Topbar } from '@/components/topbar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { GitCommit, GitPullRequest, Eye, CheckCircle, ThumbsUp, ThumbsDown, BarChart, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

type PageParams = {
    params: {
        username: string;
    }
}

const RADIAN = Math.PI / 180;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default function DeveloperProfilePage({ params }: PageParams) {
    const [developer, setDeveloper] = useState<Developer | null>(null);
    const [activityScore, setActivityScore] = useState(0);

    useEffect(() => {
        const devData = getDeveloperByUsername(params.username);
        if (devData) {
            setDeveloper(devData);
            // Simple activity score calculation
            const score = Math.min(100, Math.round((devData.monthly_commits / 50) * 60 + (devData.pull_request_reviews / 10) * 20 + (parseFloat(devData.pull_request_approval_rate) / 100) * 20));
            setActivityScore(score);
        }
    }, [params.username]);

    if (!developer) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background text-white">
                Developer not found.
            </div>
        );
    }
    
    const prRate = parseFloat(developer.pull_request_approval_rate);
    const prData = developer.pull_request_approval_rate.match(/(\d+)\s*PRs/);
    const prCount = prData ? parseInt(prData[1], 10) : 0;

    const workData = Object.entries(developer.type_of_work_in_percentage).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));


    return (
        <div className="bg-background min-h-screen text-white">
            <Topbar projectTitle="Developer Profile" />

            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 gap-6">
                    {/* Header Card */}
                    <Card className="bg-card/80 border-border/50">
                        <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
                            <Avatar className="w-24 h-24 border-4 border-primary">
                                <AvatarImage src={`https://github.com/${developer.github_username}.png`} alt={developer.github_username} data-ai-hint="person avatar"/>
                                <AvatarFallback>{developer.github_username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow text-center md:text-left">
                                <h1 className="text-4xl font-bold font-headline capitalize">{developer.github_username.replace(/[-_]/g, ' ')}</h1>
                                <p className="text-lg text-muted-foreground">@{developer.github_username}</p>
                                <div className="mt-4">
                                    <p className="text-sm font-medium">Activity Score</p>
                                    <div className="flex items-center gap-2">
                                        <Progress value={activityScore} className="w-full max-w-xs h-2 bg-secondary" />
                                        <span className="font-semibold">{activityScore}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:ml-auto text-center md:text-right">
                                <Badge variant="outline" className="text-base px-4 py-2 border-primary text-primary">Versatile Technologist</Badge>
                            </div>
                        </CardContent>
                        <CardContent className="p-6 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Top Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {developer.languages.slice(0, 5).map(lang => (
                                        <Badge key={lang} variant="secondary">{lang}</Badge>
                                    ))}
                                </div>
                            </div>
                             <div>
                                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Top Domains</h3>
                                <div className="flex flex-wrap gap-2">
                                    {developer.skills_domains.slice(0, 5).map(domain => (
                                        <Badge key={domain} variant="secondary">{domain}</Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-card/80 border-border/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Commits (30d)</CardTitle>
                                <GitCommit className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">{developer.monthly_commits}</div>
                                <p className="text-xs text-muted-foreground">Avg {developer.average_commits_per_day}/day</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/80 border-border/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">PR Approval Rate</CardTitle>
                                <GitPullRequest className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">{developer.pull_request_approval_rate}</div>
                                <p className="text-xs text-muted-foreground">{prCount} PRs created</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/80 border-border/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Reviews Given</CardTitle>
                                <Eye className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">{developer.pull_request_reviews}</div>
                                <p className="text-xs text-muted-foreground">Peer reviews completed</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/80 border-border/50">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Top Languages</CardTitle>
                                <BarChart className="w-4 h-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {developer.languages.slice(0, 3).map(lang => (
                                        <Badge key={lang} variant="secondary">{lang}</Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Strengths and Weaknesses */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <Card className="lg:col-span-3 bg-card/80 border-border/50">
                            <CardHeader>
                                <CardTitle>Strengths & Weaknesses</CardTitle>
                                <CardDescription>AI-generated analysis of development patterns.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold flex items-center gap-2 mb-2 text-green-400"><ThumbsUp className="w-5 h-5"/>Strengths</h3>
                                    <p className="text-sm text-muted-foreground">{developer.strengths}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold flex items-center gap-2 mb-2 text-red-400"><ThumbsDown className="w-5 h-5"/>Weaknesses</h3>
                                    <p className="text-sm text-muted-foreground">{developer.weakness}</p>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="lg:col-span-2 bg-card/80 border-border/50">
                            <CardHeader>
                                <CardTitle>Work Type Breakdown</CardTitle>
                                <CardDescription>Distribution of commits by category.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={workData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            stroke="hsl(var(--background))"
                                            strokeWidth={2}
                                        >
                                            {workData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'hsl(var(--card))', 
                                                borderColor: 'hsl(var(--border))',
                                                borderRadius: 'var(--radius)'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex justify-center flex-wrap gap-4 text-xs mt-2">
                                    {workData.map((entry, index) => (
                                        <div key={entry.name} className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                            <span>{entry.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
