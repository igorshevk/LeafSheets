### Freeze requirements.txt

`pipenv run pip3 freeze > requirements.txt`

### Build Docker Image

`docker build -t deepspaceprogram/leafsheets-django-staging:0.0.0 -f Dockerfile-staging .`

### First check your KOPS namespace:

##### Setting the namespace preference 

You can permanently save the namespace for` all subsequent kubectl commands in that context.

`kubectl config set-context --current --namespace=<insert-namespace-name-here>`

##### Validate it

kubectl config view --minify | grep namespace:

### Create SECRET (to Pull from Docker Registry)

`kubectl create secret docker-registry dsp-regcred --namespace=<insert-namespace-here> --docker-server=https://index.docker.io/v1/ --docker-username=<insert-username-here>--docker-password=<insert-password-here> --docker-email=<insert-email-here>`

### Create Security Group

$ aws ec2 create-security-group \
--description ${SECURITY_GROUP_NAME} \
--group-name ${SECURITY_GROUP_NAME} \
--region ${AWS_REGION}
--profile leafsheets

### Attach Security Group Rules

$ aws ec2 authorize-security-group-ingress \
--group-id ${SECURITY_GROUP_ID} \
--protocol tcp \
--port 5432 \
--cidr 0.0.0.0/0 \
--region ${AWS_REGION}
--profile leafsheets

### Create RDS Instance

In order to use an external Postgres database in the Kubernetes cluster, it needs to be created in AWS RDS.

aws rds create-db-instance \
--db-instance-identifier ${RDS_DATABASE_STAGING_NAME} \
--db-name ${RDS_DATABASE_STAGING_NAME} \
--vpc-security-group-ids ${SECURITY_GROUP_STAGING_ID} \
--allocated-storage 20 \
--db-instance-class db.t2.small \
--engine postgres \
--master-username ${RDS_DATABASE_STAGING_USER} \
--master-user-password ${RDS_DATABASE_STAGING_PW} \
--region ${AWS_REGION}
--profile leafsheets

### Create KOPS Bucket

aws s3api create-bucket \
--bucket ${RDS_KOPS_STAGING_BUCKET_NAME} \
--region ${AWS_REGION}
--create-bucket-configuration LocationConstraint=${AWS_REGION}
--profile leafsheets

### Generate Key Pair

Run command and follow prompts:

`ssh-keygen -t rsa`

### Create KOPS cluster

kops create cluster \
--name ${ROUTE53_KOPS_STAGING_DNS} \
--zones us-west-2a,us-west-2b,us-west-2c \
--state ${KOPS_STATE_STORE_STAGING} \
--node-size t2.small \
--master-size t2.small \
--node-count 1 \
--yes

### Deploy the DASHBOARD

`kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0/aio/deploy/recommended.yaml`

### View the Dashboard

`kubectl proxy`
 
### Access the Dashboard

Create a User (ServiceAccount and ClusterRoleBinding)

```
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
```

```
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-user
  namespace: kubernetes-dashboard
```

`kubectl apply -f service-account.yaml`
`kubectl apply -f cluster-role-binding.yaml`
`kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep admin-user | awk '{print $1}')`

### Delete the KOPS cluster

kops delete cluster \
--state ${KOPS_STATE_STORE_STAGING} \
--name ${ROUTE53_KOPS_STAGING_DNS} \
--yes