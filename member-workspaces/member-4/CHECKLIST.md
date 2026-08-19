# Member 4 — Completion Checklist

Use this checklist to track your progress and verify completion before submitting your work to the project coordinator.

- [ ] Environment configured (AWS CLI v2 & SSH key access ready)
- [ ] Task `M4-OPS-001` complete (VPC, Security Groups, EC2 t3.micro & RDS MySQL provisioned)
- [ ] Task `M4-OPS-002` complete (S3 bucket `cloudstay-receipts` & IAM role policies created)
- [ ] Task `M4-OPS-003` complete (Nginx reverse proxy & PM2 process manager configured)
- [ ] Task `M4-OPS-004` complete (GitHub Actions CI workflow `.github/workflows/ci.yml` passing)
- [ ] Task `M4-OPS-005` complete (CloudWatch log group `/cloudstay/app` & 5xx alarm active)
- [ ] Security Group isolation verified (RDS port 3306 blocked from public internet)
- [ ] Cost-Safety Check: All EC2 & RDS instances configured within AWS Free Tier limits
- [ ] AWS architecture evidence stored in `evidence/` directory
- [ ] `CONTRIBUTION.md` updated with actual completed tasks and commit hashes
- [ ] Changes committed to `feature/aws-devops` branch
- [ ] Pull Request opened for team review
