import { APIGatewayAuthorizerResult } from 'aws-lambda'

/**
 * @class IamService used to grant access
 */
export default class IamService {
  generateResponse(
    principalId: string,
    effect: string,
    methodArn: string,
    permissionData: any = { authorizer: true }
  ): APIGatewayAuthorizerResult {
    const policyDocument = this.generatePolicyDocument(effect, methodArn)

    return {
      context: permissionData,
      principalId,
      policyDocument,
    }
  }

  private generatePolicyDocument(
    effect: string,
    methodArn: string
  ): APIGatewayAuthorizerResult['policyDocument'] {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: methodArn,
        },
      ],
    }

    return policyDocument
  }
};
