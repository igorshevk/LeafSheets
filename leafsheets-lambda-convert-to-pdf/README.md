## TEST FUNCTION

1. `aws lambda invoke --function-name lambda_to_pdf_converter --payload '{"filename":"test-template.docx"}' output.txt && cat output.txt`


## INSTALL TO AWS LAMBDA


### STEP 1: Preliminary AWS Setup 

NOTE: Only necessary if ROLE and POLICY don't already exist.

Create a role with S3 and Lambda exec access:

1. `ROLE_NAME=leafsheets-lambdas`

2. `aws iam create-role --role-name $ROLE_NAME --assume-role-policy-document '{"Version":"2012-10-17","Statement":{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}}'`

3. `aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess --role-name $ROLE_NAME`

4. `aws iam attach-role-policy --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole --role-name $ROLE_NAME`


### STEP 2: Build LibreOffice

Luckily, good ol' @vladgolubev at Github has already created a LibreOffice build that is usable. (See https://github.com/vladgolubev/serverless-libreoffice/blob/master/STEP_BY_STEP.md for more details). 

##### BEGIN NOTE

Since we're using the Lambda Layer (.br) provided by @vladgolubev we don't need to worry about zipping and uploading our own layer. So you can ignore the following step. If however, we were uploading our own lambda layer using one of the precompiled LibreOffice builds provided by @vladgolubev, then we would need to zip it before uploading it to AWS.

1. `tar xzf lo.tar.gz && zip lo.zip $(tar tf lo.tar.gz)`

###### END NOTE


### STEP 3: Create and Publish Lambda Layer

##### You can use the prebuilt Lambda Layer. 

1. Follow the instructions provided in the README at https://github.com/shelfio/libreoffice-lambda-layer.

##### (Alternative Option) Or you can publish you own LibreOffice build as a AWS Lambda Layer.

1. (a) `ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)` or (b) `ACCOUNT_ID=$(aws sts get-caller-identity | jq -r ".Account")`

2. `LAMBDAS_BUCKET=leafsheets-lambdas-$ACCOUNT_ID` (When this is run via AWS cli it will automatically substitue the ACCOUNT ID).

3. `LAYER_NAME=libreoffice`

4. `aws s3 mb s3://$LAMBDAS_BUCKET`

5. `aws s3 cp lo.zip s3://$LAMBDAS_BUCKET`

6.  `aws lambda publish-layer-version --layer-name $LAYER_NAME --description "Libre Office" --content S3Bucket=$LAMBDAS_BUCKET,S3Key=lo.zip --compatible-runtimes python3.8`


### STEP 4: Build the image on an Amazon Linux Image using the Dockerfile. 

1. `docker build --no-cache -t deepspaceprogram/leafsheets-lambda-convert-to-pdf .`


### STEP 5: Extract the function's zip from the Docker container.

NOTE: For help on building images -> (https://blog.quiltdata.com/an-easier-way-to-build-lambda-deployment-packages-with-docker-instead-of-ec2-9050cd486ba8 and https://medium.com/@gotraveltoworld/use-docker-to-develop-the-aws-lambda-python-3-6-525007907369).

1. Determine the previously built container's ID by running `docker container ls -a` and finding the matching container name.

2. `docker cp {CONTAINER_ID}:/var/task/app.zip .` Replace {CONTAINER_ID} with the appropriate container ID.


### STEP 6: Deploy/Update the Lambda function.

1. `FUNCTION_NAME=lambda_to_pdf_converter`

2. `aws s3 cp lambda_to_pdf_converter.zip s3://$LAMBDAS_BUCKET`

3. (a) Deploy the function: `aws lambda create-function --function-name $FUNCTION_NAME --timeout 10 --role arn:aws:iam::${ACCOUNT_ID}:role/$ROLE_NAME --handler app.lambda_handler --region us-east-1 --runtime python3.8 --environment "Variables={BUCKET_NAME=$LAMBDAS_BUCKET,S3_KEY='lambda_to_pdf_converter.zip'}" --code "S3Bucket=$LAMBDAS_BUCKET,S3Key='lambda_to_pdf_converter.zip'" --region us-east-1`

3. (b) Update the function: `aws lambda update-function-code --function-name $FUNCTION_NAME --s3-bucket $LAMBDAS_BUCKET --s3-key 'lambda_to_pdf_converter.zip' --region us-east-1`


### STEP 7: Attach the Lambda Layer to our fuction.

1. `LAYER=$(aws lambda list-layer-versions --layer-name $LAYER_NAME | jq -r '.LayerVersions[0].LayerVersionArn')`

2. `aws lambda update-function-configuration --function-name $FUNCTION_NAME --layers $LAYER`