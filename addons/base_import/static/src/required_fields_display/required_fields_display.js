/** @odoo-module **/

import { Component, useState, onWillStart } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks";
import { _t } from "@web/core/l10n/translation";

export class RequiredFieldsDisplay extends Component {
    static template = "RequiredFieldsDisplay";
    static props = {
        resModel: { type: String },
    };

    setup() {
        this.orm = useService("orm");
        this.state = useState({
            requiredFields: [],
            loading: true,
            error: false,
        });

        onWillStart(async () => {
            await this.loadRequiredFields();
        });
    }

    async loadRequiredFields() {
        if (!this.props.resModel) {
            this.state.loading = false;
            return;
        }

        try {
            this.state.loading = true;
            this.state.error = false;
            
            const requiredFields = await this.orm.call(
                "base_import.import",
                "get_required_fields",
                [this.props.resModel]
            );
            
            this.state.requiredFields = requiredFields;
        } catch (error) {
            console.error("Error loading required fields:", error);
            this.state.error = true;
        } finally {
            this.state.loading = false;
        }
    }

    get hasRequiredFields() {
        return this.state.requiredFields && this.state.requiredFields.length > 0;
    }

    get requiredFieldsLabel() {
        const count = this.state.requiredFields.length;
        return count === 1 
            ? _t("1 Required Field") 
            : _t("%s Required Fields", count);
    }
}