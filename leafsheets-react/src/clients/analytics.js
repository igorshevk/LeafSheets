// Imports

import { analytics } from './firebase';

// Analytics

class GoogleAnalytics {

    setUserId(id) {
        analytics.setUserId(id);
    }

    logViewSheetsAction(order) {
        analytics.logEvent('sheets__view', {
            order: order 
        });
    }

    logSheetAction(action, sheet=null, sheetID=null) {
        if (!['sheet__view', 'sheet__add_to_cart', 'sheet__remove_from_cart', 'sheet__purchase'].includes(action)) {
            return
        }
        analytics.logEvent(action, {
            id: sheet ? sheet.id : sheetID,
            title: sheet ? sheet.title : null,
            use_case: sheet ? sheet.use_case : null,
            page_count: sheet ? sheet.page_count : null,
        });
    }

    logUserSheetAction(action, userSheet) {
        if (!['user_sheet__edit', 'user_sheet__update', 'user_sheet__save', 'user_sheet__preview', 'user_sheet__download'].includes(action)) {
            return
        }
        analytics.logEvent(action, {
            id: userSheet.id,
            sheet__title: userSheet.sheet.title,
            required_input_count: userSheet.required_input_count,
            completed_required_input_count: userSheet.completed_required_input_count,
        });
    }

    logCardAction(action) {
        if (!['card__create', 'card__delete'].includes(action)) {
            return
        }
        analytics.logEvent(action);
    }

    logAddressAction(action) {
        if (!['address__create', 'address__delete', 'address__update'].includes(action)) {
            return
        }
        analytics.logEvent(action);
    }

    logUserAction(action) {
        if (!['user__create', 'user__update', 'user__login', 'user__logout'].includes(action)) {
            return
        }
        analytics.logEvent(action)
    }

    logCompanyAction(action) {
        if (!['company__create', 'company__delete', 'company__update'].includes(action)) {
            return
        }
        analytics.logEvent(action);
    }
}

const Analytics = new GoogleAnalytics();

export default Analytics;

