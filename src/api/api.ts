import axios from "axios";

const getUserData = async (username: string) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json"
        }
      }
    );
    return response.data;
  } catch {
    return null;
  }
};

const getReposData = async (reposUrl: string) => {
  try {
    const response = await axios.get<any>(
      reposUrl,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    return response.data;
  } catch {
    return [];
  }
};

interface GitHubEvent {
  type: string;
  created_at: string;
  payload: {
    commits: Array<{
      sha: string;
      message: string;
      author: {
        name: string;
        email: string;
      };
    }>;
  };
}

const getCommitsData = async (username: string) => {
  try {
    const response = await axios.get<any>(
      `https://api.github.com/users/${username}/events/public`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );
    const events = response.data;

    const commitsByDate = events.reduce((acc: { [key: string]: number }, event: GitHubEvent) => {
      if (event.type === 'PushEvent') {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + event.payload.commits.length;
      }
      return acc;
    }, {});

    return Object.entries(commitsByDate)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  } catch {
    return [];
  }
};

// 🔥 Exporting all functions
export { getUserData, getReposData, getCommitsData };
