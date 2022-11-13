// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import { Construct } from "constructs";
import { App, TerraformOutput, TerraformStack } from "cdktf";
import { AzurermProvider } from "@cdktf/provider-azurerm/lib/provider";
import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
import { StaticSite } from "@cdktf/provider-azurerm/lib/static-site";

class ExampleWebApp extends TerraformStack {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    new AzurermProvider(this, "azureFeature", {
      features: {},
    });

    const rg = new ResourceGroup(this, "cdktf-rg", {
      name: "poad-cdktf-demo-rg",
      location: "centralus",
    });

    const app = new StaticSite(this, "cdktf-app", {
      name: "poad-cdktf-demo-app",
      location: rg.location,
      resourceGroupName: rg.name,
      skuTier: 'Free',
      skuSize: 'Free'
    });

    new TerraformOutput(this, "cdktf-app-apikey", {
      value: app.apiKey,
    });
  }
}

const app = new App();
new ExampleWebApp(app, "webapp");
app.synth();
