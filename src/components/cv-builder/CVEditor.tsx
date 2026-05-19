"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import CVDataForm from "./CVDataForm";
import CVSettingsForm from "./CVSettingsForm";
import CVTemplatesList from "./CVTemplatesList";
import { FileText, Settings, LayoutTemplate } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function CVEditor() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Tabs defaultValue="data" className="flex flex-col h-full w-full">
      <div className="px-3 sm:px-4 pt-3 sm:pt-4 border-b">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="data" className="flex items-center gap-1.5 sm:gap-2">
              <FileText className="w-4 h-4 shrink-0" />
              <span className="hidden min-[480px]:inline">{t.data}</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1.5 sm:gap-2">
              <Settings className="w-4 h-4 shrink-0" />
              <span className="hidden min-[480px]:inline">{t.settings}</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-1.5 sm:gap-2">
              <LayoutTemplate className="w-4 h-4 shrink-0" />
              <span className="hidden min-[480px]:inline">{t.templates}</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 overflow-hidden relative">
          <TabsContent value="data" className="h-full m-0 p-0 outline-none">
            <ScrollArea className="h-full px-3 sm:px-4 py-4 sm:py-6">
              <CVDataForm />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="settings" className="h-full m-0 p-0 outline-none">
            <ScrollArea className="h-full px-3 sm:px-4 py-4 sm:py-6">
              <CVSettingsForm />
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="templates" className="h-full m-0 p-0 outline-none">
            <ScrollArea className="h-full px-3 sm:px-4 py-4 sm:py-6">
              <CVTemplatesList />
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
