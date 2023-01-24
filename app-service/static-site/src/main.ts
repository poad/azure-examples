import { Construct } from "constructs";
import { App, TerraformStack } from "cdktf";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { StaticSite } from "@cdktf/provider-azurerm/lib/static-site";

class ExampleWebApp extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureRm", {
      features: {},
    });

    const rg = new ResourceGroup(this, "cdktf-rg", {
      name: "poad-cdktf-demo-rg",
      location: "centralus",
    });

    new StaticSite(this, "cdktf-app", {
      name: "poad-cdktf-demo-app",
      location: rg.location,
      resourceGroupName: rg.name,
      skuTier: 'Free',
      skuSize: 'Free'
    });
  }
}

const app = new App();
new ExampleWebApp(app, "webapp");
app.synth();
