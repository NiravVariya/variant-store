import { Octokit } from "octokit";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const filePath = path.join("public", "images", "logo.jpg");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.send({ msg: "Please check your endpoind and method" });
    return;
  }
  const token = "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";
  const owner = "my-technology-source";
  const repo = "vindyy";
  const { gitBranch, content } = req.body;

  const ref = `heads/${gitBranch}`;

  const regex = /^data:.*?base64,/;
  const base64Content = content.replace(regex, "");
  try {
    const octokit = new Octokit({
      auth: token,
    });

    console.log('is all para is righ............', owner, repo, filePath, gitBranch );
    const logoContent: any = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner,
      repo,
      ref,
      path: filePath,
      branch: gitBranch,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    console.log('logo content request............', logoContent);

    if (!logoContent.data.sha) {
      return res.status(404).json({ msg: 'Something went wrong! previous logo not found' });
    }

    const response = await octokit.request(
      "PUT /repos/{owner}/{repo}/contents/{path}",
      {
        owner,
        repo,
        branch: gitBranch,
        path: filePath,
        message: "logo uploaded",
        committer: {
          name: "nv-Empiric",
          email: "nv.empiric@gmail.com",
        },
        content: base64Content,
        sha: logoContent.data.sha,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    console.log('updating the content.........', response);

    res.status(response.status ?? 500).json({
      msg: response.data,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error.message });
  }
}