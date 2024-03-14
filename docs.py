import git

def push_testing_to_staging(src_branch, dest_branch):
    repo = git.Repo('.')

    # Push changes from testing to staging with force
    try:
        repo.git.push('origin', f"{src_branch}:{dest_branch}", force=True)
        print(f"Pushed changes from '{src_branch}' to '{dest_branch}' with force")
    except git.GitCommandError as e:
        print(f"Error pushing changes from '{src_branch}' to '{dest_branch}': {e}")

if __name__ == "__main__":
    # Replace 'testing', 'staging' with your branch names
    push_testing_to_staging('testing', 'staging')
