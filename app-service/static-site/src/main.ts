import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput, CloudBackend, NamedCloudWorkspace } from "cdktf";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { StaticSite } from "@cdktf/provider-azurerm/lib/static-site";

class ExampleWebApp extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new CloudBackend(this, {
      hostname: "app.terraform.io",
      organization: "poad",
      workspaces: new NamedCloudWorkspace("webapp"),
    });


    new AzurermProvider(this, "azureRm", {
      features: {},
    });

    const rg = new ResourceGroup(this, "cdktf-rg", {
      name: "static-site-app-rg",
      location: "centralus",
    });

    const app = new StaticSite(this, "cdktf-app", {
      name: "static-site-app",
      location: rg.location,
      resourceGroupName: rg.name,
      skuTier: 'Free',
      skuSize: 'Free'
    });

    new TerraformOutput(this, 'domain', {
      value: `https://${app.defaultHostName}`
    });
  }
}

const app = new App();
new ExampleWebApp(app, "azure-static-site-app");
app.synth();
