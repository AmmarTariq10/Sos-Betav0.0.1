package com.sosapp;
import android.app.Application;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativenavigation.NavigationApplication;
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication  {
  @Override
     public boolean isDebug() {
         return BuildConfig.DEBUG;
     }

     protected List<ReactPackage> getPackages() {

         return Arrays.<ReactPackage>asList(
             new RNFusedLocationPackage()
         );
     }

     @Override
     public List<ReactPackage> createAdditionalReactPackages() {
         return getPackages();
     }


}