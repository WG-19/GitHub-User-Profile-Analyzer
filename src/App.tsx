import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert";
import { AlertCircle } from "lucide-react";
import { getUserData, getReposData, getCommitsData } from "./api/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserData {
  login: string;
  name: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  repos_url: string;
}

interface RepoData {
  id: number;
  name: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
}

interface CommitData {
  date: string;
  count: number;
}

export default function App() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [commits, setCommits] = useState<CommitData[]>([]);
  const [username, setUsername] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;

    setError(null); // Clear error before making the request

    try {
      const data = await getUserData(trimmedUsername);
      if (!data) {
        throw new Error('User not found on GitHub');
      }
      setUserData(data);
      const reposData = await getReposData(data.repos_url);
      setRepos(reposData);
      const commitsData = await getCommitsData(data.login);
      setCommits(commitsData as CommitData[]);
    } catch {
      setError("User not found on GitHub. Please check the username and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)]">
          <div className="max-w-4xl w-full">
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center gap-2">
                <span className="text-2xl text-blue-500">🔍</span>
                <h1 className="text-3xl font-bold">GitHub User Profile Analyzer</h1>
              </div>
            </div>
          </div>

          <div className="max-w-4xl w-full">
            <div className="flex justify-center">
              <div className="max-w-md w-full mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex justify-center">
                    <Input
                      placeholder="Enter GitHub username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-96"
                    />
                  </div>
                  <div className="flex justify-center">
                    <Button type="submit" className="w-96">
                      Search
                    </Button>
                  </div>
                </form>

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
            <div className="md:order-1">
              {userData && (
                <div className="space-y-8 mt-12">
                  <Card className="max-w-md w-full mx-auto">
                    <CardHeader>
                      <CardTitle>User Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 justify-center">
                          <img
                            src={userData.avatar_url}
                            alt={userData.login}
                            className="w-20 h-20 rounded-full"
                          />
                          <div>
                            <h3 className="font-semibold text-center w-full">{userData.name || userData.login}</h3>
                            <p className="text-muted-foreground text-center w-full">@{userData.login}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center">
                            <p className="font-medium">{userData.public_repos}</p>
                            <p className="text-sm text-muted-foreground">Repositories</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium">{userData.followers}</p>
                            <p className="text-sm text-muted-foreground">Followers</p>
                          </div>
                          <div className="text-center">
                            <p className="font-medium">{userData.following}</p>
                            <p className="text-sm text-muted-foreground">Following</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="max-w-xl w-full mx-auto">
                    <CardHeader>
                      <CardTitle>Daily Commits</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {commits.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No commit history available
                        </div>
                      ) : (
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={commits}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis 
                                dataKey="date" 
                                angle={-45} 
                                textAnchor="end" 
                                height={80}
                                interval={0}
                                tick={{ fontSize: 10 }}
                              />
                              <YAxis 
                                domain={[0, 'dataMax + 1']}
                                tick={{ fontSize: 10 }}
                              />
                              <Tooltip 
                                contentStyle={{ fontSize: '12px' }}
                                labelStyle={{ fontSize: '12px' }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="count" 
                                stroke="#2563eb" 
                                strokeWidth={2}
                                dot={{ r: 4 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            <div className="md:order-2">
              {userData && (
                <Card className="max-w-xl w-full mx-auto mt-12">
                  <CardHeader>
                    <CardTitle>Repositories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {repos.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No repositories found
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {repos.map((repo) => (
                          <div key={repo.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                              <h4 className="font-medium">{repo.name}</h4>
                              <p className="text-sm text-muted-foreground">{repo.language}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm">⭐ {repo.stargazers_count}</span>
                              <span className="text-sm">🍴 {repo.forks_count}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
