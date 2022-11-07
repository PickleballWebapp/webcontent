import "@testing-library/jest-dom/extend-expect";
import awsmobile from "../aws-exports";

test("Validate AWS regions", async () => {
    expect(awsmobile.aws_project_region).toBe("us-east-1");
    expect(awsmobile.aws_appsync_region).toBe("us-east-1");
    expect(awsmobile.aws_cognito_region).toBe("us-east-1");
});
